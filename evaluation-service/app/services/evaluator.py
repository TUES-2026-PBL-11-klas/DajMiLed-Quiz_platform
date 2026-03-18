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
        
        # 1. Preprocess & Use Question: Find context relevance
        # We look for the sentence(s) in the context that most likely answer the question
        relevance_scores = []
        for sentence in sentences:
            relevance = get_similarity(request.question, sentence)
            relevance_scores.append((relevance, sentence))
            
        # Get the most relevant sentence based on the question
        relevance_scores.sort(key=lambda x: x[0], reverse=True)
        top_relevant_sentence = relevance_scores[0][1] if relevance_scores else ""
        
        # 2. Evaluate Answer: Check similarity to the most relevant part of the context
        # We combine the most relevant sentence with the student's answer for validation
        if self._is_keyword_match(request.answer, top_relevant_sentence):
            max_similarity = 0.9
        else:
            max_similarity = get_similarity(request.answer, top_relevant_sentence)
                
        is_correct = max_similarity > self.threshold
        score = round(max_similarity, 2)
        
        if is_correct:
            feedback = f"Correct! Your answer aligns with the relevant context: '{top_relevant_sentence.strip()}'"
        else:
            feedback = f"Incorrect. Your answer does not seem to match the relevant fact. Similarity score: {score}"
            
        return EvaluationResponse(
            score=score,
            feedback=feedback,
            is_correct=is_correct
        )
