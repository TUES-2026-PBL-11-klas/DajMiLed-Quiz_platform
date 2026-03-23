from pydantic import BaseModel
from typing import List, Optional

class GenerationRequest(BaseModel):
    context: str
    num_questions: Optional[int] = 3
    difficulty: Optional[str] = "intermediate"

class Question(BaseModel):
    id: Optional[int] = None
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None

class GenerationResponse(BaseModel):
    questions: List[Question]
    context_summarized: Optional[str] = None
