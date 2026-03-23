from fastapi import FastAPI, HTTPException
from app.models.generation import GenerationRequest, GenerationResponse, Question
from app.services.generator import QuestionGeneratorService
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(
    title="AI Question Generation Service",
    description="A microservice for generating quiz questions from context text using AI.",
    version="1.0.0"
)

generator_service = QuestionGeneratorService()

@app.get("/")
async def root():
    return {"message": "AI Question Generation Service is running"}

@app.post("/generate", response_model=GenerationResponse)
async def generate_questions(request: GenerationRequest):
    if not request.context or len(request.context) < 30:
        raise HTTPException(
            status_code=400, 
            detail="Context is too short for meaningful question generation. Provide at least 30 characters."
        )
    
    try:
        questions = await generator_service.generate(
            request.context, 
            request.num_questions, 
            request.difficulty
        )
        return GenerationResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
