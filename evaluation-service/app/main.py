from fastapi import FastAPI
from app.models.evaluation import EvaluationRequest, EvaluationResponse, QuestionType
from app.services.evaluator import SemanticEvaluator, ClosedQuestionEvaluator

app = FastAPI(
    title="Context Based Evaluation Service",
    description="API for context-based quiz evaluation.",
    version="0.1.0",
)

semantic_evaluator = SemanticEvaluator(threshold=0.46)
closed_evaluator = ClosedQuestionEvaluator()

@app.get("/")
async def root():
    return {"message": "Context Based Evaluation Service is up and running!"}

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluationRequest):
    if request.question_type == QuestionType.closed:
        return closed_evaluator.evaluate(request)
    return semantic_evaluator.evaluate(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
