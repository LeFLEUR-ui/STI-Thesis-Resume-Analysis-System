import io
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_submit_job_description():
    response = client.post(
        "/hr/job-description",
        data={
            "job_id": "job123",
            "skills_requirements": "Python FastAPI SQL"
        }
    )

    assert response.status_code == 200
    assert "Job description stored" in response.json()["message"]


def test_upload_resume():
    client.post(
        "/hr/job-description",
        data={
            "job_id": "job123",
            "skills_requirements": "Python FastAPI SQL"
        }
    )

    fake_file = io.BytesIO(b"Sample resume text with Python FastAPI SQL experience")

    response = client.post(
        "/candidate/upload",
        data={"job_id": "job123"},
        files={"files": ("resume.txt", fake_file, "text/plain")}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
