from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="Context Based Evaluation Service",
    description="API for context-based quiz evaluation.",
    version="0.1.0",
)

class EvaluationRequest(BaseModel):
    context: str
    question: str
    answer: str

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    is_correct: bool

@app.get("/")
async def root():
    return {"message": "Context Based Evaluation Service is up and running!"}

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluationRequest):

    return EvaluationResponse(
        score=1.0, 
        feedback="Sample feedback: Your answer is correct based on the provided context.",
        is_correct=True
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
