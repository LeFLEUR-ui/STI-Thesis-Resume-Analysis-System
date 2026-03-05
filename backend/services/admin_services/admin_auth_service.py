from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

import helpers.models as models
import helpers.auth as auth
from helpers.database import get_db
import helpers.schemas as schemas

router = APIRouter()

# ADMIN LOGIN
@router.post("/login", response_model=schemas.Token)
def admin_login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    admin = db.query(models.Admin).filter(models.Admin.email == email).first()

    if not admin or not auth.verify_password(password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": admin.email, "role": "admin"})

    return {"access_token": access_token, "token_type": "bearer"}


# UPDATE SYSTEM CONFIG
@router.put("/config")
def update_config(
    matching_threshold: int,
    skills_weight: int,
    experience_weight: int,
    education_weight: int,
    db: Session = Depends(get_db)
):
    config = db.query(models.SystemConfig).first()

    if not config:
        config = models.SystemConfig()
        db.add(config)

    config.matching_threshold = matching_threshold
    config.skills_weight = skills_weight
    config.experience_weight = experience_weight
    config.education_weight = education_weight
    config.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(config)

    return {"message": "System config updated", "config": config}


# VIEW AUDIT LOGS
@router.get("/auditlogs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).all()
    return logs


# ADMIN ARCHIVE RESUME
@router.put("/archive_resume/{resume_id}")
def archive_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume.is_archived = True
    resume.archived_at = datetime.utcnow()

    # audit log
    log = models.AuditLog(
        actor_type="admin",
        actor_id=1,  # replace with authenticated admin id
        action="archive_resume",
        target_type="resume",
        target_id=resume.id
    )

    db.add(log)
    db.commit()
    db.refresh(resume)

    return {"message": "Resume archived by admin"}


# ACTIVATE / DEACTIVATE HR USER
@router.put("/hr/{hr_id}/toggle")
def toggle_hr_status(
    hr_id: int,
    db: Session = Depends(get_db)
):
    hr = db.query(models.HR).filter(models.HR.id == hr_id).first()

    if not hr:
        raise HTTPException(status_code=404, detail="HR user not found")

    hr.is_active = not hr.is_active

    # audit log
    log = models.AuditLog(
        actor_type="admin",
        actor_id=1,  # replace with authenticated admin id
        action="activate_hr" if hr.is_active else "deactivate_hr",
        target_type="hr",
        target_id=hr.id
    )

    db.add(log)
    db.commit()
    db.refresh(hr)

    return {
        "message": f"HR {'activated' if hr.is_active else 'deactivated'} successfully",
        "hr_id": hr.id,
        "is_active": hr.is_active
    }
