from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

import helpers.models as models
from helpers.database import get_db

router = APIRouter()

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

    log = models.AuditLog(
        actor_type="admin",
        actor_id=1,  # replace with actual admin ID from auth
        action="archive_resume",
        target_type="resume",
        target_id=resume.id
    )

    db.add(log)
    db.commit()
    db.refresh(resume)

    return {"message": "Resume archived by admin"}

@router.put("/hr/{hr_id}/toggle")
def toggle_hr_status(hr_id: int, db: Session = Depends(get_db)):
    hr = db.query(models.HR).filter(models.HR.id == hr_id).first()
    if not hr:
        raise HTTPException(status_code=404, detail="HR user not found")

    hr.is_active = not hr.is_active

    log = models.AuditLog(
        actor_type="admin",
        actor_id=1,  # replace with actual admin ID from auth
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