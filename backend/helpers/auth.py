# auth.py

# -----------------------------
# IMPORTS
# -----------------------------
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session

from helpers.database import SessionLocal
import helpers.models as models


# -----------------------------
# LOAD ENV VARIABLES
# -----------------------------
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env")


# -----------------------------
# PASSWORD HASHING (ARGON2)
# -----------------------------
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# -----------------------------
# DATABASE DEPENDENCY
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# JWT TOKEN CREATION
# -----------------------------
def create_access_token(data: dict):
    """
    Expected data example:
    {
        "sub": "email@example.com",
        "role": "admin"
    }
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# -----------------------------
# BEARER AUTH (SWAGGER SUPPORT)
# -----------------------------
bearer_scheme = HTTPBearer()


# -----------------------------
# CURRENT HR USER
# -----------------------------
def get_current_hr(
    token: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate HR credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    hr = db.query(models.HR).filter(
        models.HR.email == email
    ).first()

    if hr is None:
        raise credentials_exception

    return hr


# -----------------------------
# CURRENT ADMIN USER
# -----------------------------
def get_current_admin(
    token: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email: str = payload.get("sub")
        role: str = payload.get("role")

        if email is None or role != "admin":
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    admin = db.query(models.Admin).filter(
        models.Admin.email == email
    ).first()

    if admin is None:
        raise credentials_exception

    return admin