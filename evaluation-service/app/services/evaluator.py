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

    def _is_affirmation(self, answer: str) -> bool:
        tokens = {"yes", "yeah", "yep", "it is", "correct", "true", "indeed"}
        return any(t in answer.lower() for t in tokens)

    def _is_denial(self, answer: str) -> bool:
        tokens = {"no", "nope", "not really", "false", "wrong", "incorrect", "is not"}
        return any(t in answer.lower() for t in tokens)

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        sentences = self._split_into_sentences(request.context)
        
        relevance_scores = []
        for sentence in sentences:
            relevance = get_similarity(request.question, sentence)
            relevance_scores.append((relevance, sentence))
            
        relevance_scores.sort(key=lambda x: x[0], reverse=True)
        
        top_n = relevance_scores[:3]  
        
        max_overall_similarity = 0.0
        best_match_sentence = ""
        
        is_binary = self._is_affirmation(request.answer) or self._is_denial(request.answer)
        
        for rel_score, sentence in top_n:
            if is_binary:
                if self._is_affirmation(request.answer):
                    similarity = rel_score 
                else: 
                    similarity = 1.0 - rel_score 
            else:
                if self._is_keyword_match(request.answer, sentence):
                    similarity = 0.95
                else:
                    similarity = get_similarity(request.answer, sentence)
            
            if similarity > max_overall_similarity:
                max_overall_similarity = similarity
                best_match_sentence = sentence
                
        if is_binary and max_overall_similarity < 0.3:
             pass
                
        is_correct = max_overall_similarity > self.threshold
        score = round(max_overall_similarity, 2)
        
        if is_correct:
            feedback = f"Correct! Your answer aligns with the relevant context: '{best_match_sentence.strip()}'"
        else:
            suggestion = f" Most relevant fact found: '{best_match_sentence.strip()}'" if best_match_sentence else ""
            feedback = f"Incorrect. Your answer does not seem to match the relevant fact. Similarity score: {score}.{suggestion}"
            
        return EvaluationResponse(
            score=score,
            feedback=feedback,
            is_correct=is_correct
        )
