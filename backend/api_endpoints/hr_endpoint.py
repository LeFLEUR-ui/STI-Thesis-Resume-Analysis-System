from datetime import datetime
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Form, Path as FastAPIPath, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from services.hr_services import hr_auth_service, resume_service
from services.hr_services import candidate_service, job_service

router = APIRouter(prefix="/hr", tags=["HR"])

router.include_router(hr_auth_service.router)
router.include_router(job_service.router)
router.include_router(resume_service.router)
router.include_router(candidate_service.router)