from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Form, Path as FastAPIPath, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
import os, helpers.models as models, helpers.auth as auth

router = APIRouter()

# Get all resumes
@router.get("/resumes")
def get_resumes(status: str = None, archived: bool = False, db=Depends(auth.get_db), hr=Depends(auth.get_current_hr)):
    query = db.query(models.Resume).filter(models.Resume.is_archived == archived)
    if status: query = query.filter(models.Resume.status == status)
    
    return [{
        "id": r.id,
        "name": r.applicant_name,
        "profileImage": r.profile_image,
        "status": r.status,
        "preferredJob": r.job.title if r.job else None,
        "skills": r.candidate.skills if r.candidate else None,
        "date": r.date_uploaded.strftime("%Y-%m-%d %H:%M") if r.date_uploaded else None,
        "matchScore": r.candidate.match_score if r.candidate else 0
    } for r in query.all()]

# Get resume stats
@router.get("/resumes/stats")
def get_resume_stats(db: Session = Depends(auth.get_db), hr=Depends(auth.get_current_hr)):
    return {
        "total": db.query(models.Resume).count(),
        "pending": db.query(models.Resume).filter_by(status="pending").count(),
        "reviewed": db.query(models.Resume).filter_by(status="reviewed").count()
    }

# UPdate resume status
@router.put("/resume/{resume_id}/status")
def update_status(resume_id: int, status: str = Form(...), db=Depends(auth.get_db), hr=Depends(auth.get_current_hr)):
    resume = db.query(models.Resume).get(resume_id)
    if not resume: raise HTTPException(404, "Resume not found")
    resume.status = status
    db.commit()
    return {"message": "Status updated"}

# Edit resume's metadata
@router.put("/resume/{resume_id}/edit")
def edit_resume_metadata(
    resume_id: int = FastAPIPath(..., description="ID of the resume to edit"),
    email: Optional[str] = Form(None, description="Candidate email"),
    phone_number: Optional[str] = Form(None, description="Candidate phone number"),
    status: Optional[str] = Form(None, description="Resume status: approved, rejected, pending"),
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if email:
        resume.email = email
    if phone_number:
        resume.phone_number = phone_number
    if status:
        if status not in ["approved", "rejected", "pending"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        resume.status = status

    resume.updated_at = datetime.utcnow()
    resume.updated_by = current_hr.id  # make sure Resume table has these fields

    db.commit()
    db.refresh(resume)

    return {"message": f"Resume {resume.filename} metadata updated successfully"}

# Archieve Resume
@router.put("/resume/{resume_id}/archive")
def archive_resume(resume_id: int, db: Session = Depends(auth.get_db), hr=Depends(auth.get_current_hr)):
    resume = db.query(models.Resume).get(resume_id)
    resume.is_archived = True
    resume.archived_at = datetime.utcnow()
    db.commit()
    return {"message": "Archived successfully"}

# Delete resume - PUBLIC ENDPOINT
@router.delete("/resume/{resume_id}")
def delete_resume(
    resume_id: int = FastAPIPath(..., description="ID of the resume to delete"),
    db: Session = Depends(auth.get_db) 
    # Removed: current_hr: models.HR = Depends(auth.get_current_hr)
):
    # 1. Fetch the resume record
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # 2. Handle physical file deletion
    file_path = resume.file_path
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            # We catch this so the DB doesn't get out of sync with the storage
            raise HTTPException(status_code=500, detail=f"Failed to delete physical file: {str(e)}")

    # 3. Delete from database
    try:
        filename = resume.filename # Store name before deleting object
        db.delete(resume)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database deletion failed")

    return {"message": f"Resume {filename} has been deleted successfully"}

@router.put("/resume/{resume_id}/archive")
def archive_resume(
    resume_id: int = FastAPIPath(..., description="ID of the resume to archive"),
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume.is_archived:
        raise HTTPException(status_code=400, detail="Resume is already archived")

    resume.is_archived = True
    resume.archived_at = datetime.utcnow()
    db.commit()
    db.refresh(resume)

    return {"message": f"Resume {resume.filename} has been archived successfully"}


# UNARCHIVE RESUME
@router.put("/resume/{resume_id}/unarchive")
def unarchive_resume(
    resume_id: int = FastAPIPath(..., description="ID of the resume to unarchive"),
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.is_archived:
        return {"message": f"Resume {resume.filename} is already active"}

    resume.is_archived = False
    resume.archived_at = None
    db.commit()
    db.refresh(resume)

    return {"message": f"Resume {resume.filename} has been unarchived successfully"}

# Search by email
@router.get("/resume/search/email")
def search_resume_by_email(
    email: str = Query(..., description="Candidate email to search"),
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    resumes = db.query(models.Resume).filter(models.Resume.email.ilike(f"%{email}%")).all()
    return {"count": len(resumes), "resumes": resumes}


# Search by phone number
@router.get("/resume/search/phone_number")
def search_resume_by_phone(
    phone_number: str = Query(..., description="Candidate phone number to search"),
    db: Session = Depends(auth.get_db),
    current_hr: models.HR = Depends(auth.get_current_hr)
):
    resumes = db.query(models.Resume).filter(models.Resume.phone_number.ilike(f"%{phone_number}%")).all()
    return {"count": len(resumes), "resumes": resumes}
