from sentence_transformers import SentenceTransformer


# ============================================================
# SENTENCE TRANSFORMER EMBEDDINGS
# ============================================================
#
# An embedding model converts text into a numerical vector
# that represents the semantic meaning of the text.
#
# For example, these two sentences have different words:
#
#   "How can I improve my credit score?"
#   "What can I do to increase my credit rating?"
#
# but they have a similar meaning. Their embeddings should
# therefore be relatively close to each other.
#
# We use all-MiniLM-L6-v2 because it is a relatively small
# model that can run locally on our Intel Mac.
#
# The model produces a 384-dimensional vector for each text.
# ============================================================

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)


def create_embeddings(texts: list[str]):
    """
    Convert a list of text strings into embedding vectors.

    One embedding vector is created for each text.

    Example:

        texts = [
            "Payment history affects your credit score.",
            "Credit utilization is another important factor."
        ]

    The result contains one numerical vector for each text.
    """

    return embedding_model.encode(
        texts,
        normalize_embeddings=True,
    )
    