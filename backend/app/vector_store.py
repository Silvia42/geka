from sentence_transformers import SentenceTransformer


# ============================================================
# EMBEDDING MODEL
# ============================================================
#
# SentenceTransformer converts text into numerical vectors
# called embeddings.
#
# An embedding represents the semantic meaning of text as a
# list of numbers.
#
# For example:
#
#   "How can I improve my credit score?"
#
# and
#
#   "Ways to increase your credit rating"
#
# use different words, but their meanings are similar.
# Their embeddings should therefore be relatively close
# together in vector space.
#
# We use a local model, so GEKA does not need a paid API.
#
# all-MiniLM-L6-v2 is a relatively small and commonly used
# sentence-transformer model that is appropriate for this
# local MVP.
# ============================================================

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)


def create_embeddings(texts: list[str]):
    """
    Convert a list of text strings into embedding vectors.

    Input:
        texts = [
            "Credit scores are calculated...",
            "Payment history is important..."
        ]

    Output:
        A list/array of numerical vectors.

    Each text gets one vector.
    """
    return embedding_model.encode(
        texts,
        normalize_embeddings=True,
    )
