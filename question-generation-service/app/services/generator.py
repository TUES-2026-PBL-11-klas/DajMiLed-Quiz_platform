import os
import json
from typing import List, Optional
from huggingface_hub import InferenceClient
from app.models.generation import Question

class QuestionGeneratorService:
    def __init__(self):
        # We'll use the Hugging Face Token and Model ID from environment variables
        self.hf_token = os.getenv("HF_TOKEN")
        self.model_id = os.getenv("HF_MODEL_ID", "Qwen/Qwen3.5-27B")
        
        # We initialize the client but it might be None if token is missing
        # This allows tests to initialize the service and then mock the client
        self.client = None
        if self.hf_token:
            self._init_client()

    def _init_client(self):
        self.client = InferenceClient(
            model=self.model_id,
            token=self.hf_token
        )

    async def generate(self, context: str, num_questions: int = 3, difficulty: str = "intermediate") -> List[Question]:
        # Lazily initialize if needed (useful for environment variable changes or late token setting)
        if not self.client:
            self.hf_token = os.getenv("HF_TOKEN")
            if not self.hf_token:
                 raise ValueError("HF_TOKEN not found. Please set your Hugging Face API token.")
            self._init_client()

        prompt = f"""
        Objective: Generate {num_questions} multiple-choice questions from the context below at {difficulty} difficulty.
        The questions must be fact-based and relevant to the text provided.
        Format: Each question should include exactly four options, a correct answer, and a short explanation.

        Context: 
        {context}

        Output format (STRICT JSON array of objects):
        [
          {{
            "question_text": "text of the question",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "The correct option from the list",
            "explanation": "Brief explanation of the answer"
          }}
        ]
        
        Important: Reply ONLY with the JSON array. Do not include introductory text or markdown code blocks.
        """

        try:
            # We use the chat completion style for better structured output
            response = self.client.chat_completion(
                messages=[
                    {"role": "system", "content": "You are an educator skilled in creating concise and challenging quiz questions. You MUST respond with pure JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )

            raw_content = response.choices[0].message.content.strip()
            
            # Robust extraction of JSON from code blocks if necessary
            if "```" in raw_content:
                # Find the first [ and last ] or first { and last }
                if "[" in raw_content and "]" in raw_content:
                    start = raw_content.find("[")
                    end = raw_content.rfind("]") + 1
                    raw_content = raw_content[start:end]
                elif "{" in raw_content and "}" in raw_content:
                    start = raw_content.find("{")
                    end = raw_content.rfind("}") + 1
                    raw_content = raw_content[start:end]

            parsed_data = json.loads(raw_content)

            # Robust handling of various possible response structures
            questions_raw = []
            if isinstance(parsed_data, dict):
                if "questions" in parsed_data:
                    questions_raw = parsed_data["questions"]
                elif "question_text" in parsed_data: # Single object
                    questions_raw = [parsed_data]
            elif isinstance(parsed_data, list):
                questions_raw = parsed_data

            questions = []
            for i, q in enumerate(questions_raw):
                # Only add if it looks like a question
                if isinstance(q, dict) and "question_text" in q:
                    questions.append(Question(
                        id=i + 1,
                        question_text=q.get("question_text", "No question text"),
                        options=q.get("options", ["A", "B", "C", "D"]),
                        correct_answer=q.get("correct_answer", ""),
                        explanation=q.get("explanation", "")
                    ))
            
            return questions

        except json.JSONDecodeError as je:
            print(f"JSON Parsing Error: {je} - Raw content: {raw_content}")
            raise Exception("Model returned invalid JSON format. Try again.")
        except Exception as e:
            print(f"Error during HF inference: {e}")
            raise Exception(f"Failed to generate questions: {str(e)}")
