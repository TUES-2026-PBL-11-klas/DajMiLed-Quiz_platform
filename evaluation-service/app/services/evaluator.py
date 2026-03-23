import re
from features.text2vec import get_similarity
from app.models.evaluation import EvaluationResponse, EvaluationRequest

class BaseEvaluator:
    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        raise NotImplementedError("Subclasses must implement evaluate()")

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
