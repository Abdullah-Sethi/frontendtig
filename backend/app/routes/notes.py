from flask import Blueprint, jsonify, request
from app.storage.notes_store import (
    get_notes,
    create_note,
    update_note,
    delete_note,
)

notes_bp = Blueprint("notes", __name__)


@notes_bp.route("/notes", methods=["GET"])
def list_notes():
    return jsonify(get_notes()), 200


@notes_bp.route("/notes", methods=["POST"])
def add_note():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON request"}), 400

    title = data.get("title")
    content = data.get("content")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "Title is required"}), 400

    if not isinstance(content, str):
        return jsonify({"error": "Content must be a string"}), 400

    note = create_note(title.strip(), content)
    return jsonify(note), 201


@notes_bp.route("/notes/<note_id>", methods=["PUT"])
def edit_note(note_id):
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON request"}), 400

    title = data.get("title")
    content = data.get("content")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "Title is required"}), 400

    if not isinstance(content, str):
        return jsonify({"error": "Content must be a string"}), 400

    note = update_note(note_id, title.strip(), content)

    if note is None:
        return jsonify({"error": "Note not found"}), 404

    return jsonify(note), 200


@notes_bp.route("/notes/<note_id>", methods=["DELETE"])
def remove_note(note_id):
    if not delete_note(note_id):
        return jsonify({"error": "Note not found"}), 404

    return jsonify({"message": "Note deleted"}), 200