from typing import List
from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

import helpers.models as models
from helpers.auth import get_db

router = APIRouter()

# FOLLOW-UP QUESTION GENERATOR
def generate_followup_questions(info: dict) -> List[dict]:
    questions = []
    if not info.get("emails"):
        questions.append({"field": "email", "question_text": "Please provide your email address."})
    if not info.get("phone_numbers"):
        questions.append({"field": "phone_number", "question_text": "Please provide your phone number."})
    if not info.get("experience"):
        questions.append({"field": "experience", "question_text": "Please provide details regarding your work experience."})
    if not info.get("education"):
        questions.append({"field": "education", "question_text": "What is your highest educational attainment?"})
    return questions

# SUBMIT ANSWERS TO CLARIFICATION QUESTIONS
@router.post("/answer")
def submit_answers(
    resume_id: int = Form(...),
    answers: List[str] = Form(...),
    db: Session = Depends(get_db)
):
    questions = db.query(models.ClarificationQuestion)\
        .filter_by(resume_id=resume_id)\
        .order_by(models.ClarificationQuestion.id)\
        .all()
    if not questions:
        raise HTTPException(status_code=404, detail="No clarification questions found for this resume")
    if len(answers) != len(questions):
        raise HTTPException(status_code=400, detail="Number of answers does not match number of questions")

    for question, answer_text in zip(questions, answers):
        db.add(models.CandidateAnswer(
            question_id=question.id,
            answer_text=answer_text,
            date_submitted=datetime.utcnow()
        ))
        question.answered = True

    db.commit()
    return {"message": "Answers submitted successfully"}