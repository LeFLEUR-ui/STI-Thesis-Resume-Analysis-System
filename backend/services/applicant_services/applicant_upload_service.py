from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import os

import helpers.models as models
from helpers.auth import get_db
from helpers.info_extractor import SUPPORTED_TYPES, extract_info, extract_resume_image
from nlp.nlp_service import match_skills

router = APIRouter()

# Load .env variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter()
TOP_N_RECOMMENDATIONS = 3


TOP_N_RECOMMENDATIONS = 3

# CANDIDATE UPLOAD RESUMES
@router.post("/")
async def upload_resumes(
    job_id: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    primary_job = db.query(models.JobDescription)\
        .filter(models.JobDescription.job_id == job_id)\
        .first()
    if not primary_job:
        raise HTTPException(status_code=404, detail="Primary Job ID not found")

    all_jobs = db.query(models.JobDescription).all()
    results = []

    for file in files:
        if file.content_type not in SUPPORTED_TYPES:
            continue

        file_bytes = await file.read()
        info = extract_info(file_bytes, file.content_type)

        # --- PROFILE IMAGE ---
        profile_image_bytes = extract_resume_image(file_bytes, file.content_type)
        profile_image_url = None
        if profile_image_bytes:
            image_filename = f"{datetime.now().timestamp()}_{file.filename}.jpg"
            supabase.storage.from_("profile_images").upload(
                path=image_filename,
                file=profile_image_bytes,
                file_options={"content-type": "image/jpeg"}
            )
            profile_image_url = supabase.storage.from_("profile_images").get_public_url(image_filename)

        # --- RESUME FILE ---
        resume_filename = f"{datetime.now().timestamp()}_{file.filename}"
        supabase.storage.from_("resumes").upload(
            path=resume_filename,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        resume_url = supabase.storage.from_("resumes").get_public_url(resume_filename)

        # --- DB RECORD ---
        education_str = "\n".join(info.get("education", []))
        full_text = info.get("text", "")

        new_resume = models.Resume(
            filename=file.filename,
            file_path=resume_url,
            applicant_name=info.get("name", "Unknown"),
            email=info.get("emails")[0] if info.get("emails") else None,
            phone_number=info.get("phone_numbers")[0] if info.get("phone_numbers") else None,
            education=education_str,
            experience=full_text,
            profile_image=profile_image_url,
            date_uploaded=datetime.utcnow(),
            status="pending",
            job=primary_job
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        # --- JOB MATCHING ---
        recommended_jobs = []
        for job in all_jobs:
            skill_result = match_skills(full_text, job.skills_requirements)
            recommended_jobs.append({
                "job_title": job.title,
                "job_id": job.job_id,
                "match_percentage": skill_result.get("percentage_match", 0),
                "is_primary": job.id == primary_job.id
            })

        recommended_jobs.sort(key=lambda x: x["match_percentage"], reverse=True)
        top_recommendations = recommended_jobs[:TOP_N_RECOMMENDATIONS]

        results.append({
            "resume_id": new_resume.id,
            "applicant_name": new_resume.applicant_name,
            "filename": file.filename,
            "email": new_resume.email,
            "profile_image": profile_image_url,
            "top_recommendations": top_recommendations
        })

    return JSONResponse(content=results)