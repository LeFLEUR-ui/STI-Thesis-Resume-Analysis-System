from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from helpers.database import Base


# =========================
# HR USERS
# =========================
class HR(Base):
    __tablename__ = "hr_users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)

    hashed_password = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # HR -> Jobs
    jobs = relationship(
        "JobDescription",
        back_populates="hr_owner",
        cascade="all, delete-orphan"
    )

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# =========================
# JOB DESCRIPTION
# =========================
class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)

    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)

    employment_type = Column(String, default="Full-time")
    job_type = Column(String, default="On-site")

    salary_range = Column(String)
    description = Column(Text, nullable=True)
    skills_requirements = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    hr_id = Column(Integer, ForeignKey("hr_users.id"))
    hr_owner = relationship("HR", back_populates="jobs")

    is_active = Column(Boolean, default=True)

    # Job -> Resumes
    resumes = relationship(
        "Resume",
        back_populates="job",
        cascade="all, delete-orphan"
    )

    # ✅ FIXED: Job -> Candidates
    candidates = relationship(
        "Candidate",
        back_populates="job",
        cascade="all, delete-orphan"
    )


# =========================
# RESUMES
# =========================
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    profile_image = Column(String, nullable=True)

    applicant_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    education = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)

    date_uploaded = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")

    is_archived = Column(Boolean, default=False, nullable=False)
    archived_at = Column(DateTime, nullable=True)

    # Resume -> Job
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"))
    job = relationship("JobDescription", back_populates="resumes")

    # Resume -> Candidate (1-to-1)
    candidate = relationship(
        "Candidate",
        back_populates="resume",
        uselist=False
    )

    clarification_questions = relationship(
        "ClarificationQuestion",
        back_populates="resume",
        cascade="all, delete-orphan"
    )


# =========================
# CANDIDATES
# =========================
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)

    status = Column(String, default="pending")
    preferred_job = Column(String)
    skills = Column(JSON)
    match_score = Column(Integer)
    location = Column(String)

    applied_at = Column(DateTime, default=datetime.utcnow)

    # Candidate -> Resume
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"))
    resume = relationship("Resume", back_populates="candidate")

    # Candidate -> Job
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="SET NULL"))
    job = relationship("JobDescription", back_populates="candidates")


# =========================
# CLARIFICATION QUESTIONS
# =========================
class ClarificationQuestion(Base):
    __tablename__ = "clarification_questions"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"))
    field_name = Column(String, nullable=False)
    question_text = Column(Text, nullable=False)

    answered = Column(Boolean, default=False)
    date_created = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="clarification_questions")

    answers = relationship(
        "CandidateAnswer",
        back_populates="question",
        cascade="all, delete-orphan"
    )


# =========================
# CANDIDATE ANSWERS
# =========================
class CandidateAnswer(Base):
    __tablename__ = "candidate_answers"

    id = Column(Integer, primary_key=True, index=True)

    question_id = Column(Integer, ForeignKey("clarification_questions.id", ondelete="CASCADE"))
    answer_text = Column(Text, nullable=False)

    date_submitted = Column(DateTime, default=datetime.utcnow)

    question = relationship("ClarificationQuestion", back_populates="answers")


# =========================
# ADMIN USERS
# =========================
class Admin(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# SYSTEM CONFIG
# =========================
class SystemConfig(Base):
    __tablename__ = "system_config"

    id = Column(Integer, primary_key=True, index=True)

    matching_threshold = Column(Integer, default=70)
    skills_weight = Column(Integer, default=60)
    experience_weight = Column(Integer, default=30)
    education_weight = Column(Integer, default=10)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# =========================
# AUDIT LOGS
# =========================
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    actor_type = Column(String)
    actor_id = Column(Integer)

    action = Column(String)
    target_type = Column(String)
    target_id = Column(Integer)

    timestamp = Column(DateTime, default=datetime.utcnow)