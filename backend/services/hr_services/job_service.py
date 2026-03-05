from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import helpers.models as models, helpers.auth as auth

router = APIRouter()

@router.post("/job-description")
def submit_job_description(
    job_id: str = Form(...), title: str = Form(...),
    department: str = Form(...), location: str = Form(...),
    job_type: str = Form(...), salary_range: str = Form(...),
    description: str = Form(None), skills_requirements: str = Form(...),
    current_hr: models.HR = Depends(auth.get_current_hr),
    db: Session = Depends(auth.get_db)
):
    if db.query(models.JobDescription).filter_by(job_id=job_id).first():
        raise HTTPException(status_code=400, detail="Job ID already exists")

    job = models.JobDescription(
        job_id=job_id, title=title, department=department,
        location=location, job_type=job_type, salary_range=salary_range,
        description=description, skills_requirements=skills_requirements,
        hr_id=current_hr.id
    )
    db.add(job); db.commit(); db.refresh(job)
    return {"message": "Job created successfully", "id": job.id}

@router.get("/jobs")
def get_all_jobs(db: Session = Depends(auth.get_db)):
    return db.query(models.JobDescription).filter_by(is_active=True).order_by(models.JobDescription.created_at.desc()).all()

@router.get("/jobs/{job_id}")
def get_single_job(job_id: int, db: Session = Depends(auth.get_db)):
    job = db.query(models.JobDescription).get(job_id)
    if not job: raise HTTPException(status_code=404, detail="Job not found")
    return job