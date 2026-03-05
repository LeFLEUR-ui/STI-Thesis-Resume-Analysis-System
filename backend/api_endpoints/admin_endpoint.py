from fastapi import APIRouter

from services.admin_services.admin_auth_service import router as admin_auth_router
from services.admin_services.admin_config_service import router as admin_config_router
from services.admin_services.admin_manage_service import router as admin_manage_router

router = APIRouter(prefix="/admin", tags=["Admin"])

router.include_router(admin_auth_router)
router.include_router(admin_config_router)
router.include_router(admin_manage_router)