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
        return re.split(r'(?<=[.!?]) +', text)

    def _is_keyword_match(self, answer: str, sentence: str) -> bool:
        answer_clean = answer.strip().lower()
        sentence_clean = sentence.strip().lower()
        return answer_clean in sentence_clean and len(answer_clean) > 2

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        sentences = self._split_into_sentences(request.context)
        
        max_similarity = 0.0
        best_match_sentence = ""
        
        for sentence in sentences:
            if self._is_keyword_match(request.answer, sentence):
                similarity = 0.9
            else:
                similarity = get_similarity(request.answer, sentence)
                
            if similarity > max_similarity:
                max_similarity = similarity
                best_match_sentence = sentence
                
        is_correct = max_similarity > self.threshold
        score = round(max_similarity, 2)
        
        if is_correct:
            feedback = f"Correct! Your answer aligns with the context. Best match: '{best_match_sentence.strip()}'"
        else:
            feedback = f"Incorrect. Your answer does not seem to match the context well. Similarity score: {score}"
            
        return EvaluationResponse(
            score=score,
            feedback=feedback,
            is_correct=is_correct
        )
