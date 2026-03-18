from features.text2vec import get_similarity

q = "Is Python high-level?"
s1 = "Python is a high-level, general-purpose programming language."
s2 = "Python is dynamically type-checked and garbage-collected."

print(f"Similarity with correct sentence: {get_similarity(q, s1)}")
print(f"Similarity with incorrect sentence: {get_similarity(q, s2)}")
