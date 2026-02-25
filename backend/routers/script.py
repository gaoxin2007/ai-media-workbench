from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from services import DouyinService, AIService

router = APIRouter(prefix="/api/script", tags=["script"])

@router.post("/extract", response_model=schemas.ScriptResponse)
async def extract_script(
    url: str = None, 
    file: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    transcript = ""
    source_type = ""
    source_content = ""

    if url:
        source_type = "link"
        source_content = url
        video_data = DouyinService.get_video_data(url)
        transcript = video_data["transcript"]
    elif file:
        source_type = "upload"
        source_content = file.filename
        # Mock ASR
        transcript = "This is a transcript from the uploaded video file..."
    else:
        raise HTTPException(status_code=400, detail="Either url or file must be provided")

    db_script = models.VideoScript(
        source_type=source_type,
        source_content=source_content,
        transcript=transcript
    )
    db.add(db_script)
    db.commit()
    db.refresh(db_script)
    return db_script

@router.post("/rewrite", response_model=List[schemas.RewriteVersionResponse])
def rewrite_script(input: schemas.RewriteRequest, db: Session = Depends(get_db)):
    db_script = db.query(models.VideoScript).filter(models.VideoScript.id == input.script_id).first()
    if not db_script:
        raise HTTPException(status_code=404, detail="Script not found")

    styles = ["hook", "professional", "emotional"]
    results = []

    for style in styles:
        new_content = AIService.rewrite_script(db_script.transcript, style)
        
        db_rewrite = models.RewriteVersion(
            script_id=input.script_id,
            style=style,
            content=new_content
        )
        db.add(db_rewrite)
        db.commit()
        db.refresh(db_rewrite)
        results.append(db_rewrite)

    return results
