from flask import Blueprint, request, jsonify
from datetime import datetime
import numpy as np
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

OFFLINE = os.getenv("OFFLINE_TESTS")
if not OFFLINE:
    import huggingface_hub

    # sentence-transformers 2.2 imports `cached_download` from
    # `huggingface_hub`, which was removed in newer versions. Provide a
    # backwards compatible alias so the import succeeds without pinning an
    # older hub version.
    if not hasattr(huggingface_hub, "cached_download"):
        huggingface_hub.cached_download = huggingface_hub.hf_hub_download

    from sentence_transformers import SentenceTransformer
from sqlalchemy import desc

from ..models import db, Principle
from ..schemas import PrincipleOut
from ..config import Config

# Only return search results that exceed this similarity threshold
SIMILARITY_THRESHOLD = 0.75

principles_bp = Blueprint('principles', __name__)
if OFFLINE:
    class _DummyModel:
        def encode(self, text):
            return [0.0]

    model = _DummyModel()
else:
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


if OFFLINE:
    def preprocess_text(text: str) -> str:
        """Simplified text normalization used during offline testing."""
        return text.lower()
else:
    import spacy

    nlp = spacy.load("en_core_web_sm")

    def preprocess_text(text: str) -> str:
        """Normalize text by removing stop words and punctuation and lemmatizing."""
        doc = nlp(text)
        tokens = [
            tok.lemma_.lower()
            for tok in doc
            if not tok.is_stop and not tok.is_punct
        ]
        return " ".join(tokens)

@principles_bp.route('', methods=['POST'])
@jwt_required()
def add_principle():
    user_id = get_jwt_identity()
    data = request.get_json()
    text_val = data.get('text', '').strip()
    if not text_val:
        return jsonify({'error': 'Text required'}), 400
    processed = preprocess_text(text_val)
    emb = model.encode(processed).tolist()

    p = Principle(
        user_id=user_id,
        text=text_val,
        embedding=emb,
        created_at=datetime.utcnow(),
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'id': str(p.id), 'text': p.text, 'created_at': p.created_at.isoformat()})


@principles_bp.route('', methods=['GET'])
@jwt_required()
def list_principles():
    user_id = get_jwt_identity()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    q = Principle.query.filter_by(user_id=user_id, deleted=False).order_by(desc(Principle.created_at))
    items = q.paginate(page=page, per_page=page_size, error_out=False).items
    return jsonify([
        {
            'id': str(p.id),
            'text': p.text,
            'created_at': p.created_at.isoformat(),
        }
        for p in items
    ])


@principles_bp.route('/search', methods=['GET'])
@jwt_required()
def search():
    user_id = get_jwt_identity()
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    processed_query = preprocess_text(query)
    emb = model.encode(processed_query)
    topk = int(request.args.get('topK', 10))
    threshold = float(request.args.get('threshold', SIMILARITY_THRESHOLD))
    items = Principle.query.filter_by(user_id=user_id, deleted=False).all()
    results = []
    for p in items:
        vec = np.array(p.embedding)
        sim = float(np.dot(vec, emb) / (np.linalg.norm(vec) * np.linalg.norm(emb)))
        if sim >= threshold:
            results.append(
                {
                    'id': str(p.id),
                    'text': p.text,
                    'created_at': p.created_at.isoformat(),
                    'similarity': sim,
                }
            )
    results.sort(key=lambda r: r['similarity'], reverse=True)
    return jsonify(results[:topk])


@principles_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh_embeddings():
    """Recompute embeddings for all of a user's principles."""
    user_id = get_jwt_identity()
    items = Principle.query.filter_by(user_id=user_id, deleted=False).all()
    count = 0
    for p in items:
        processed = preprocess_text(p.text)
        p.embedding = model.encode(processed).tolist()
        count += 1
    db.session.commit()
    return jsonify({'updated': count})


@principles_bp.route('/<uuid:pid>', methods=['DELETE'])
@jwt_required()
def delete_principle(pid):
    user_id = get_jwt_identity()
    p = Principle.query.filter_by(id=pid, user_id=user_id, deleted=False).first_or_404()
    p.deleted = True
    db.session.commit()
    return '', 204
