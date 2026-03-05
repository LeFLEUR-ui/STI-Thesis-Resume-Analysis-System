from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

import helpers.models as models
from helpers.database import get_db

router = APIRouter()

# UPDATE SYSTEM CONFIG
@router.put("/")
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