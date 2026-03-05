from fastapi import FastAPI
from helpers.database import Base
from helpers.database import engine
from api_endpoints.hr_endpoint import router as hr_router
from api_endpoints.applicant_endpoint import router as applicant_router
from api_endpoints.admin_endpoint import router as admin_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mariwasa Siam Ceramics Incorporated")

Base.metadata.create_all(bind=engine)

app.include_router(hr_router)
app.include_router(applicant_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)