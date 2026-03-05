from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import helpers.models as models, helpers.schemas as schemas, helpers.auth as auth

router = APIRouter()

@router.post("/register")
def register(user: schemas.HRCreate, db: Session = Depends(auth.get_db)):
    if db.query(models.HR).filter(models.HR.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.HR(
        first_name=user.firstName,
        last_name=user.lastName,
        email=user.email,
        phone_number=user.phoneNumber,
        hashed_password=auth.hash_password(user.password),
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    return {"message": "HR account created successfully"}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.HRLogin, db: Session = Depends(auth.get_db)):
    db_user = db.query(models.HR).filter(models.HR.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}