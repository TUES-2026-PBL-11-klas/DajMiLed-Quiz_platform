import pytest
from unittest.mock import MagicMock, patch
from app.services.generator import QuestionGeneratorService
from app.models.generation import Question
import json

@pytest.fixture
def generator():
    with patch.dict("os.environ", {"HF_TOKEN": "mock-token", "HF_MODEL_ID": "mock-model"}):
        return QuestionGeneratorService()

@pytest.mark.asyncio
async def test_generate_success(generator):
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='[{"question_text": "Test Question?", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "Test explanation"}]'))
    ]
    
    generator.client = MagicMock()
    with patch.object(generator.client, "chat_completion", return_value=mock_response):
        questions = await generator.generate("This is a context that is long enough to generate questions from.", 1)
        
        assert len(questions) == 1
        assert questions[0].question_text == "Test Question?"
        assert questions[0].correct_answer == "A"
        assert len(questions[0].options) == 4

@pytest.mark.asyncio
async def test_generate_with_markdown_blocks(generator):
    markdown_content = '```json\n[{"question_text": "Markdown Test?", "options": ["A", "B", "C", "D"], "correct_answer": "B", "explanation": "Markdown test"}]\n```'
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content=markdown_content))
    ]
    
    generator.client = MagicMock()
    with patch.object(generator.client, "chat_completion", return_value=mock_response):
        questions = await generator.generate("This is a context that is long enough to generate questions from.", 1)
        
        assert len(questions) == 1
        assert questions[0].question_text == "Markdown Test?"
        assert questions[0].correct_answer == "B"

@pytest.mark.asyncio
async def test_generate_invalid_json(generator):
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='Invalid JSON content'))
    ]
    
    generator.client = MagicMock()
    with patch.object(generator.client, "chat_completion", return_value=mock_response):
        with pytest.raises(Exception) as excinfo:
            await generator.generate("This is a context that is long enough to generate questions from.", 1)
        assert "Model returned invalid JSON format" in str(excinfo.value)
