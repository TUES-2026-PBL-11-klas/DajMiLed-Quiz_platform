import re
from app.models.evaluation import EvaluationResponse, EvaluationRequest

class BaseEvaluator:
    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        raise NotImplementedError("Subclasses must implement evaluate()")


class ClosedQuestionEvaluator(BaseEvaluator):
    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        if not request.correct_answer:
            return EvaluationResponse(
                score=0.0,
                feedback="Cannot evaluate closed question: no correct_answer provided.",
                is_correct=False,
            )

        user = request.answer.strip().lower()
        correct = request.correct_answer.strip().lower()

        # Accept matching on the option letter alone (e.g. "a") or the full text
        # of the correct option (e.g. "Paris").
        is_correct = user == correct

        # Also try matching against the full text of the correct option when the
        # caller passes the letter ("a") as correct_answer and the user typed the
        # full option text, or vice-versa.
        if not is_correct and request.options:
            # Map letter index to option text
            letter_to_text = {
                chr(ord("a") + i): opt.strip().lower()
                for i, opt in enumerate(request.options)
            }
            text_to_letter = {v: k for k, v in letter_to_text.items()}

            correct_text = letter_to_text.get(correct, correct)
            correct_letter = text_to_letter.get(correct, correct)

            is_correct = user in (correct_text, correct_letter)

        score = 1.0 if is_correct else 0.0

        if is_correct:
            feedback = f"Correct! '{request.answer}' matches the expected answer."
        else:
            feedback = (
                f"Incorrect. You answered '{request.answer}', "
                f"but the correct answer is '{request.correct_answer}'."
            )

        return EvaluationResponse(score=score, feedback=feedback, is_correct=is_correct)

class SemanticEvaluator(BaseEvaluator):
    def __init__(self, threshold: float = 0.65):
        self.threshold = threshold

    def _split_into_sentences(self, text: str) -> list[str]:
        return re.split(r'(?<=[.!?])\s+', text)

    def _is_keyword_match(self, answer: str, sentence: str) -> bool:
        a = answer.strip().lower()
        s = sentence.strip().lower()
        return a in s and len(a) > 2

    def _is_affirmation(self, answer: str) -> bool:
        tokens = ["yes", "yeah", "yep", "it is", "correct", "true", "indeed", "it's"]
        a = answer.strip().lower()
        return any(re.search(rf"\b{re.escape(t)}\b", a) for t in tokens)

    def _is_denial(self, answer: str) -> bool:
        tokens = ["no", "nope", "not really", "false", "wrong", "incorrect", "is not", "it isn't"]
        a = answer.strip().lower()
        return any(re.search(rf"\b{re.escape(t)}\b", a) for t in tokens)

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        from features.text2vec import get_similarity
        sentences = [s.strip() for s in self._split_into_sentences(request.context) if s.strip()]
        rel_scores = []
        for s in sentences:
            rel_scores.append((get_similarity(request.question, s), s))
        rel_scores.sort(key=lambda x: x[0], reverse=True)
        
        is_pos = self._is_affirmation(request.answer)
        is_neg = self._is_denial(request.answer)
        
        if is_neg:
            b_score, b_sent = rel_scores[0] if rel_scores else (0.0, "")
            score = 1.0 - b_score
            best_match = b_sent
        elif is_pos:
            b_score, b_sent = rel_scores[0] if rel_scores else (0.0, "")
            score = b_score
            best_match = b_sent
        else:
            top_n = rel_scores[:3]
            score = 0.0
            best_match = ""
            for r_s, s in top_n:
                sim = 0.95 if self._is_keyword_match(request.answer, s) else get_similarity(request.answer, s)
                if sim > score:
                    score = sim
                    best_match = s
                    
        is_correct = score > self.threshold
        s_val = round(score, 2)
        
        if is_correct:
            fb = f"Correct! Your answer aligns with the relevant context: '{best_match}'"
        else:
            sug = f" Most relevant fact found: '{best_match}'" if best_match else ""
            fb = f"Incorrect. Your answer does not seem to match the relevant fact. Similarity score: {s_val}.{sug}"
            
        return EvaluationResponse(score=s_val, feedback=fb, is_correct=is_correct)
