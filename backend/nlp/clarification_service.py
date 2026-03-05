from datetime import datetime
import helpers.models as models
from sqlalchemy.orm import Session

def save_clarification_questions(db: Session, resume_id: int, questions: list):
    saved_questions = []

    for q in questions:
        cq = models.ClarificationQuestion(
            resume_id=resume_id,
            field_name=q["field"],
            question_text=q["question_text"],
            answered=False
        )
        db.add(cq)
        db.flush()
        saved_questions.append({"id": cq.id, "question_text": cq.question_text})

    db.commit()
    return saved_questions