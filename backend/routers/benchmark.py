from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from services import DouyinService, AIService

router = APIRouter(prefix="/api/benchmark", tags=["benchmark"])

@router.post("/search", response_model=List[schemas.BenchmarkAccountResponse])
def search_benchmark(input: schemas.BenchmarkSearch, db: Session = Depends(get_db)):
    # 1. Search Douyin via Service
    accounts = DouyinService.search_accounts(input.keyword)
    
    results = []
    for acc in accounts:
        # 2. Generate AI Analysis
        analysis = AIService.generate_benchmark_analysis(acc["account_name"])
        
        # 3. Save to DB
        db_acc = models.BenchmarkAccount(
            keyword=input.keyword,
            account_name=acc["account_name"],
            user_id=acc["user_id"],
            profile_url=acc["profile_url"],
            analysis_reason=analysis["analysis_reason"],
            learning_points=analysis["learning_points"]
        )
        db.add(db_acc)
        db.commit()
        db.refresh(db_acc)
        results.append(db_acc)
        
    return results
