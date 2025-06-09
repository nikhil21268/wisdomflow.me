from flask import Blueprint, request, jsonify
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
from sqlalchemy.sql import text
from sqlalchemy import desc

from ..models import db, Principle
from ..schemas import PrincipleOut
from ..config import Config

principles_bp = Blueprint('principles', __name__)
if OFFLINE:
    class _DummyModel:
        def encode(self, text):
            return [0.0]

    model = _DummyModel()
else:
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


# TODO: integrate spaCy preprocessing

@principles_bp.route('', methods=['POST'])
@jwt_required()
def add_principle():
    user_id = get_jwt_identity()
    data = request.get_json()
    text_val = data.get('text', '').strip()
    if not text_val:
        return jsonify({'error': 'Text required'}), 400
    emb = model.encode(text_val).tolist()
    p = Principle(user_id=user_id, text=text_val, embedding=emb)
    db.session.add(p)
    db.session.commit()
    return jsonify({'id': str(p.id), 'text': p.text})


@principles_bp.route('', methods=['GET'])
@jwt_required()
def list_principles():
    user_id = get_jwt_identity()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))
    q = Principle.query.filter_by(user_id=user_id, deleted=False).order_by(desc(Principle.created_at))
    items = q.paginate(page=page, per_page=page_size, error_out=False).items
    return jsonify([{'id': str(p.id), 'text': p.text} for p in items])


@principles_bp.route('/search', methods=['GET'])
@jwt_required()
def search():
    user_id = get_jwt_identity()
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    emb = model.encode(query).tolist()
    sql = text('''
        SELECT id, text, created_at, 1 - (embedding <=> :vector) AS similarity
        FROM principles
        WHERE user_id = :user_id AND deleted = false
        ORDER BY embedding <=> :vector
        LIMIT :topk
    ''')
    res = db.session.execute(sql, {'vector': emb, 'user_id': user_id, 'topk': int(request.args.get('topK', 10))})
    results = [dict(r) for r in res]
    for r in results:
        r['id'] = str(r['id'])
    return jsonify(results)


@principles_bp.route('/<uuid:pid>', methods=['DELETE'])
@jwt_required()
def delete_principle(pid):
    user_id = get_jwt_identity()
    p = Principle.query.filter_by(id=pid, user_id=user_id, deleted=False).first_or_404()
    p.deleted = True
    db.session.commit()
    return '', 204
