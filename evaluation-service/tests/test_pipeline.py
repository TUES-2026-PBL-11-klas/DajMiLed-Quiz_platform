import requests
import unittest
import time
import os

def get_wikipedia_context(title):
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    headers = {
        'User-Agent': 'EvaluationServiceTest/1.0 (contact: test@example.com)'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get('extract', '')
    return ""

CONTEXT_APOLLO = get_wikipedia_context("Apollo_11")
CONTEXT_PYTHON = get_wikipedia_context("Python_(programming_language)")

TEST_CASES = [
    {
        "context": CONTEXT_APOLLO,
        "question": "Who was the commander of Apollo 11?",
        "answer": "Neil Armstrong",
        "expected_correct": True
    },
    {
        "context": CONTEXT_APOLLO,
        "question": "What was the nickname of the Lunar Module?",
        "answer": "Eagle",
        "expected_correct": True
    },
    {
        "context": CONTEXT_APOLLO,
        "question": "When did the first humans land on the moon?",
        "answer": "July 20, 1969",
        "expected_correct": True
    },
    {
        "context": CONTEXT_PYTHON,
        "question": "What does Python emphasize in its design philosophy?",
        "answer": "Code Readability",
        "expected_correct": True
    },
    {
        "context": CONTEXT_PYTHON,
        "question": "Does Python use significant indentation?",
        "answer": "No",
        "expected_correct": False
    },
    {
        "context": CONTEXT_PYTHON,
        "question": "What kind of programming paradigms does Python support?",
        "answer": "OOP, functional, structured",
        "expected_correct": True
    },
    {
        "context": CONTEXT_PYTHON,
        "question": "Is Python high-level?",
        "answer": "Yes",
        "expected_correct": True
    },
    {
        "context": CONTEXT_PYTHON,
        "question": "Who created Python?",
        "answer": "Elon Musk",
        "expected_correct": False
    },
    {
        "context": CONTEXT_APOLLO,
        "question": "Where did they land?",
        "answer": "Middle",
        "expected_correct": False
    },
    {
        "context": CONTEXT_APOLLO,
        "question": "What is the capital of France?",
        "answer": "Paris",
        "expected_correct": False 
    }
]

CLOSED_TEST_CASES = [
    # Correct answer given as matching letter
    {
        "context": CONTEXT_APOLLO,
        "question": "Who was the first human to walk on the moon? a) Buzz Aldrin b) Neil Armstrong c) Michael Collins d) Yuri Gagarin",
        "answer": "b",
        "correct_answer": "b",
        "options": ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
        "expected_correct": True,
    },
    # Wrong letter
    {
        "context": CONTEXT_APOLLO,
        "question": "Who was the first human to walk on the moon? a) Buzz Aldrin b) Neil Armstrong c) Michael Collins d) Yuri Gagarin",
        "answer": "a",
        "correct_answer": "b",
        "options": ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
        "expected_correct": False,
    },
    # User answers with full option text, correct_answer is a letter
    {
        "context": CONTEXT_PYTHON,
        "question": "Who created Python? a) James Gosling b) Guido van Rossum c) Linus Torvalds d) Bjarne Stroustrup",
        "answer": "Guido van Rossum",
        "correct_answer": "b",
        "options": ["James Gosling", "Guido van Rossum", "Linus Torvalds", "Bjarne Stroustrup"],
        "expected_correct": True,
    },
    # Correct answer given as full text, user types full text
    {
        "context": CONTEXT_PYTHON,
        "question": "What paradigm does Python support? a) Only OOP b) Only functional c) Multiple paradigms d) Only procedural",
        "answer": "Multiple paradigms",
        "correct_answer": "Multiple paradigms",
        "options": ["Only OOP", "Only functional", "Multiple paradigms", "Only procedural"],
        "expected_correct": True,
    },
    # Case-insensitive letter match
    {
        "context": CONTEXT_APOLLO,
        "question": "What module landed on the moon? a) Eagle b) Columbia c) Discovery d) Endeavour",
        "answer": "A",
        "correct_answer": "a",
        "options": ["Eagle", "Columbia", "Discovery", "Endeavour"],
        "expected_correct": True,
    },
    # Missing correct_answer → should return False gracefully
    {
        "context": CONTEXT_APOLLO,
        "question": "Some question without a correct answer?",
        "answer": "a",
        "correct_answer": None,
        "options": None,
        "expected_correct": False,
    },
]


class TestEvaluationPipeline(unittest.TestCase):
    BASE_URL = "http://localhost:8000"

    def test_evaluate_endpoint(self):
        passed = 0
        failed = 0
        for i, case in enumerate(TEST_CASES):
            payload = {
                "context": case["context"],
                "question": case["question"],
                "answer": case["answer"]
            }
            try:
                response = requests.post(f"{self.BASE_URL}/evaluate", json=payload)
                self.assertEqual(response.status_code, 200, f"Failed on case {i}: {case['question']}")
                data = response.json()

                is_correct = data["is_correct"]
                print(f"CASE {i+1}:")
                print(f"Q: {case['question']}")
                print(f"A: {case['answer']}")
                print(f"Result: {'PASS' if is_correct == case['expected_correct'] else 'FAIL'}")
                print(f"Model Result: {'Correct' if is_correct else 'Incorrect'} (Expected: {'Correct' if case['expected_correct'] else 'Incorrect'})")
                print(f"Feedback: {data['feedback']}")
                print("-" * 30)

                if is_correct == case["expected_correct"]:
                    passed += 1
                else:
                    failed += 1

            except requests.exceptions.ConnectionError:
                self.fail("Evaluation service is not running.")

        print(f"\nTest Summary: {passed} passed, {failed} failed out of {len(TEST_CASES)}")

    def test_closed_question_endpoint(self):
        passed = 0
        failed = 0
        for i, case in enumerate(CLOSED_TEST_CASES):
            payload = {
                "context": case["context"],
                "question": case["question"],
                "answer": case["answer"],
                "question_type": "closed",
                "correct_answer": case["correct_answer"],
                "options": case["options"],
            }
            try:
                response = requests.post(f"{self.BASE_URL}/evaluate", json=payload)
                self.assertEqual(response.status_code, 200, f"Failed on closed case {i}: {case['question']}")
                data = response.json()

                is_correct = data["is_correct"]
                print(f"CLOSED CASE {i+1}:")
                print(f"Q: {case['question']}")
                print(f"A: {case['answer']} (correct: {case['correct_answer']})")
                print(f"Result: {'PASS' if is_correct == case['expected_correct'] else 'FAIL'}")
                print(f"Model Result: {'Correct' if is_correct else 'Incorrect'} (Expected: {'Correct' if case['expected_correct'] else 'Incorrect'})")
                print(f"Feedback: {data['feedback']}")
                print("-" * 30)

                if is_correct == case["expected_correct"]:
                    passed += 1
                else:
                    failed += 1

            except requests.exceptions.ConnectionError:
                self.fail("Evaluation service is not running.")

        print(f"\nClosed Question Test Summary: {passed} passed, {failed} failed out of {len(CLOSED_TEST_CASES)}")
        self.assertEqual(failed, 0, f"{failed} closed question test(s) produced unexpected results.")


if __name__ == "__main__":
    unittest.main()
