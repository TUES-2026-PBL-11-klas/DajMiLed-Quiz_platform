from sentence_transformers import SentenceTransformer, util
import torch

model = SentenceTransformer('all-MiniLM-L6-v2')

def convert_text_to_vec(text: str) -> list[float]:
    return model.encode(text).tolist()

def get_similarity(text1: str, text2: str) -> float:
    vec1 = model.encode(text1, convert_to_tensor=True)
    vec2 = model.encode(text2, convert_to_tensor=True)
    return float(util.cos_sim(vec1, vec2))

if __name__ == "__main__":
    t1 = "Apollo 11 landed on the moon."
    t2 = "The first humans landed on the moon in 1969."
    print(f"Similarity: {get_similarity(t1, t2)}")
    