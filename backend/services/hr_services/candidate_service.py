from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import helpers.models as models, helpers.auth as auth

router = APIRouter()

# Retrieve or get all candidates
@router.get("/candidates", response_model=List[dict])
def get_all_candidates(
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    candidates = db.query(models.Candidate).all()
    
    result = []
    for c in candidates:
        result.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone_number": c.phone_number,
            "status": c.status,
            "location": c.location,
            "match_score": c.match_score,
            "applied_at": c.applied_at.isoformat() if c.applied_at else None,
            "resume_id": c.resume_id,
            "job_id": c.job_id
        })
    return result


# GET OR retrieve individual candidate
@router.get("/candidates/{candidate_id}")
def get_candidate(
    candidate_id: int, 
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return {
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "phone_number": candidate.phone_number,
        "status": candidate.status,
        "skills": candidate.skills,
        "match_score": candidate.match_score,
        "location": candidate.location,
        "applied_at": candidate.applied_at,
        "resume_id": candidate.resume_id,
        "job_id": candidate.job_id
    }