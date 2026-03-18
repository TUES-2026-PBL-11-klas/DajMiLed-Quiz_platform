from pydantic import BaseModel
from typing import Optional

class EvaluationRequest(BaseModel):
    context: str
    question: str
    answer: str

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    is_correct: bool
