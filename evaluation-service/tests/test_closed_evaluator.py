"""
Unit tests for ClosedQuestionEvaluator.
These tests run entirely in-process — no running server required.
"""
import unittest
from app.models.evaluation import EvaluationRequest, QuestionType
from app.services.evaluator import ClosedQuestionEvaluator

CONTEXT = "The capital of France is Paris. Python was created by Guido van Rossum."


def make_request(answer: str, correct_answer: str, options=None):
    return EvaluationRequest(
        context=CONTEXT,
        question="Sample closed question",
        answer=answer,
        question_type=QuestionType.closed,
        correct_answer=correct_answer,
        options=options,
    )


class TestClosedQuestionEvaluator(unittest.TestCase):
    def setUp(self):
        self.ev = ClosedQuestionEvaluator()

    # --- exact letter match ---

    def test_correct_letter_exact(self):
        res = self.ev.evaluate(make_request("a", "a"))
        self.assertTrue(res.is_correct)
        self.assertEqual(res.score, 1.0)

    def test_wrong_letter(self):
        res = self.ev.evaluate(make_request("b", "a"))
        self.assertFalse(res.is_correct)
        self.assertEqual(res.score, 0.0)

    def test_case_insensitive_letter(self):
        res = self.ev.evaluate(make_request("A", "a"))
        self.assertTrue(res.is_correct)

    def test_correct_letter_with_whitespace(self):
        res = self.ev.evaluate(make_request("  b  ", "b"))
        self.assertTrue(res.is_correct)

    # --- full option text match ---

    def test_correct_full_text(self):
        res = self.ev.evaluate(make_request("Paris", "Paris"))
        self.assertTrue(res.is_correct)

    def test_wrong_full_text(self):
        res = self.ev.evaluate(make_request("London", "Paris"))
        self.assertFalse(res.is_correct)

    def test_correct_full_text_case_insensitive(self):
        res = self.ev.evaluate(make_request("paris", "Paris"))
        self.assertTrue(res.is_correct)

    # --- cross-matching: letter vs full text when options list is provided ---

    OPTIONS = ["Paris", "London", "Berlin", "Madrid"]

    def test_user_answers_letter_correct_answer_is_full_text(self):
        # correct_answer="Paris" (index 0 → "a"), user answers "a"
        res = self.ev.evaluate(make_request("a", "Paris", options=self.OPTIONS))
        self.assertTrue(res.is_correct)

    def test_user_answers_full_text_correct_answer_is_letter(self):
        # correct_answer="a", user answers "Paris"
        res = self.ev.evaluate(make_request("Paris", "a", options=self.OPTIONS))
        self.assertTrue(res.is_correct)

    def test_user_answers_wrong_letter_with_options(self):
        res = self.ev.evaluate(make_request("b", "a", options=self.OPTIONS))
        self.assertFalse(res.is_correct)

    def test_user_answers_wrong_text_with_options(self):
        res = self.ev.evaluate(make_request("London", "Paris", options=self.OPTIONS))
        self.assertFalse(res.is_correct)

    def test_all_four_options_correct(self):
        for i, city in enumerate(self.OPTIONS):
            letter = chr(ord("a") + i)
            with self.subTest(option=city, letter=letter):
                res = self.ev.evaluate(make_request(letter, city, options=self.OPTIONS))
                self.assertTrue(res.is_correct)

    # --- missing correct_answer ---

    def test_missing_correct_answer_returns_false(self):
        req = EvaluationRequest(
            context=CONTEXT,
            question="Q?",
            answer="a",
            question_type=QuestionType.closed,
        )
        res = self.ev.evaluate(req)
        self.assertFalse(res.is_correct)
        self.assertEqual(res.score, 0.0)
        self.assertIn("no correct_answer", res.feedback)

    # --- feedback content ---

    def test_correct_feedback_message(self):
        res = self.ev.evaluate(make_request("a", "a"))
        self.assertIn("Correct", res.feedback)

    def test_incorrect_feedback_contains_correct_answer(self):
        res = self.ev.evaluate(make_request("b", "a"))
        self.assertIn("a", res.feedback)
        self.assertIn("Incorrect", res.feedback)


if __name__ == "__main__":
    unittest.main()
