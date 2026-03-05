from fastapi import APIRouter
from services.applicant_services import applicant_auth_service, applicant_upload_service, applicant_interaction_service

router = APIRouter(prefix="/candidate", tags=["Applicant"])

router.include_router(applicant_auth_service.router)
router.include_router(applicant_upload_service.router)
router.include_router(applicant_interaction_service.router)