from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session

import helpers.models as models
from helpers.auth import get_db, hash_password, verify_password

router = APIRouter()

# CANDIDATE REGISTRATION
@router.post("/register")
def register_candidate(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone_number: str = Form(...),
    location: str = Form(None),
    db: Session = Depends(get_db)
):
    existing_candidate = db.query(models.Candidate)\
        .filter(models.Candidate.email == email)\
        .first()
    if existing_candidate:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(password)

    new_candidate = models.Candidate(
        name=name,
        email=email,
        password=hashed_pw,
        phone_number=phone_number,
        location=location,
        status="pending"
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return {
        "message": "Candidate registered successfully",
        "candidate_id": new_candidate.id,
        "name": new_candidate.name,
        "email": new_candidate.email
    }

# CANDIDATE LOGIN
@router.post("/login")
def candidate_login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    candidate = db.query(models.Candidate)\
        .filter(models.Candidate.email == email)\
        .first()

    if not candidate or not verify_password(password, candidate.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "status": candidate.status
        }
    }