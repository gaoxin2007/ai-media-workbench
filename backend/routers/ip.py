from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from services import AIService
from typing import List

router = APIRouter(prefix="/api/ip", tags=["ip"])

@router.post("/generate", response_model=schemas.IPProfileResponse)
async def generate_ip(input: schemas.IPInput, db: Session = Depends(get_db)):
    # 1. Call AI Service (New Async Method)
    # Note: AIService.generate_ip_positioning will raise HTTPException if API Key is missing or API fails
    result: schemas.IPPositioningResult = await AIService.generate_ip_positioning(input)

    # 2. Save to DB
    # We populate both legacy fields (for simple display if needed) and new JSON fields
    
    # Map complex objects to simple strings/lists for legacy fields if possible
    legacy_persona = result.positioning_one_liner
    legacy_audience = result.audience_profiles[0].name if result.audience_profiles else "General"
    legacy_pillars = [p.pillar for p in result.content_pillars]
    legacy_usp = result.differentiation[0] if result.differentiation else "N/A"

    db_ip = models.IPProfile(
        user_input=input.model_dump(),  # Legacy
        input_json=input.model_dump(),  # New
        result_json=result.model_dump(), # New
        persona=legacy_persona,
        audience=legacy_audience,
        content_pillars=legacy_pillars,
        usp=legacy_usp
    )
    db.add(db_ip)
    db.commit()
    db.refresh(db_ip)
    
    return db_ip

@router.get("/history", response_model=List[schemas.IPHistoryItem])
def get_ip_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    # Order by created_at desc
    history = db.query(models.IPProfile).order_by(models.IPProfile.created_at.desc()).offset(skip).limit(limit).all()
    
    # Map to HistoryItem
    result = []
    for item in history:
        # positioning_one_liner might be in result_json or persona
        one_liner = item.persona
        if item.result_json and "positioning_one_liner" in item.result_json:
            one_liner = item.result_json["positioning_one_liner"]
            
        result.append(schemas.IPHistoryItem(
            id=item.id,
            created_at=item.created_at,
            positioning_one_liner=one_liner
        ))
    return result

@router.get("/{id}", response_model=schemas.IPProfileResponse)
def get_ip_detail(id: int, db: Session = Depends(get_db)):
    db_ip = db.query(models.IPProfile).filter(models.IPProfile.id == id).first()
    if not db_ip:
        raise HTTPException(status_code=404, detail="IP Profile not found")
    return db_ip

@router.put("/{id}", response_model=schemas.IPProfileResponse)
def update_ip_result(id: int, result: schemas.IPPositioningResult, db: Session = Depends(get_db)):
    db_ip = db.query(models.IPProfile).filter(models.IPProfile.id == id).first()
    if not db_ip:
        raise HTTPException(status_code=404, detail="IP Profile not found")
    
    # Update result_json
    db_ip.result_json = result.model_dump()
    
    # Update legacy fields for consistency
    db_ip.persona = result.positioning_one_liner
    db_ip.audience = result.audience_profiles[0].name if result.audience_profiles else "General"
    db_ip.content_pillars = [p.pillar for p in result.content_pillars]
    db_ip.usp = result.differentiation[0] if result.differentiation else "N/A"
    
    db.commit()
    db.refresh(db_ip)
    return db_ip
