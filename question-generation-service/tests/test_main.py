from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Question Generation Service is running"}

def test_generate_short_context():
    response = client.post(
        "/generate",
        json={"context": "Too short", "num_questions": 1}
    )
    assert response.status_code == 400
    assert "Context is too short" in response.json()["detail"]
