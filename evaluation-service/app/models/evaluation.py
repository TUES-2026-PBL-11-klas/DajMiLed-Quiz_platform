from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class QuestionType(str, Enum):
    open = "open"
    closed = "closed"

class EvaluationRequest(BaseModel):
    context: str
    question: str
    answer: str
    question_type: QuestionType = QuestionType.open
    correct_answer: Optional[str] = None
    options: Optional[List[str]] = None

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    is_correct: bool
