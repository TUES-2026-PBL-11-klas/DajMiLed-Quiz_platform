from fastapi import FastAPI
from app.models.evaluation import EvaluationRequest, EvaluationResponse
from app.services.evaluator import SemanticEvaluator

app = FastAPI(
    title="Context Based Evaluation Service",
    description="API for context-based quiz evaluation.",
    version="0.1.0",
)

evaluator = SemanticEvaluator(threshold=0.55)

@app.get("/")
async def root():
    return {"message": "Context Based Evaluation Service is up and running!"}

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluationRequest):
    return evaluator.evaluate(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
