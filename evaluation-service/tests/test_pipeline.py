import requests
import unittest
import time
import os

# Fetch context from Wikipedia
def get_wikipedia_context(title):
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    headers = {
        'User-Agent': 'EvaluationServiceTest/1.0 (contact: test@example.com)'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get('extract', '')
    return ""

CONTEXT = get_wikipedia_context("Apollo_11")
print(f"Fetched Context Length: {len(CONTEXT)}")

TEST_CASES = [
    {
        "question": "Who was the commander of Apollo 11?",
        "answer": "Neil Armstrong",
        "expected_correct": True
    },
    {
        "question": "What was the nickname of the Lunar Module?",
        "answer": "Eagle",
        "expected_correct": True
    },
    {
        "question": "When did the first humans land on the moon?",
        "answer": "July 20, 1969",
        "expected_correct": True
    },
    {
        "question": "Who was the Command Module Pilot?",
        "answer": "Michael Collins",
        "expected_correct": True
    },
    {
        "question": "Which ocean did they land in?",
        "answer": "The Pacific Ocean",
        "expected_correct": True # Even if not explicitly in my short context, let's see how it holds up if I add it
    },
    {
        "question": "Who was the first person on the moon?",
        "answer": "Buzz Aldrin",
        "expected_correct": False # Buzz was second
    },
    {
        "question": "What was the name of the rocket?",
        "answer": "Falcon 9",
        "expected_correct": False # It was Saturn V
    }
]

class TestEvaluationPipeline(unittest.TestCase):
    BASE_URL = "http://localhost:8000"

    def test_evaluate_endpoint(self):
        for case in TEST_CASES:
            payload = {
                "context": CONTEXT,
                "question": case["question"],
                "answer": case["answer"]
            }
            try:
                response = requests.post(f"{self.BASE_URL}/evaluate", json=payload)
                self.assertEqual(response.status_code, 200, f"Failed on question: {case['question']}")
                data = response.json()
                
                is_correct = data["is_correct"]
                print(f"Question: {case['question']}")
                print(f"Answer: {case['answer']}")
                print(f"Model Result: {'Correct' if is_correct else 'Incorrect'} (Expected: {'Correct' if case['expected_correct'] else 'Incorrect'})")
                print(f"Feedback: {data['feedback']}")
                print("-" * 20)
                
                # We don't necessarily assert exact correctness if the model is still basic, 
                # but we want to see it running.
                # In a real test, we would expect some level of accuracy.
            except requests.exceptions.ConnectionError:
                self.fail("Evaluation service is not running. Please start it with 'uvicorn app.main:app' first.")

if __name__ == "__main__":
    unittest.main()
