import json
import os
import uuid
from datetime import datetime, timezone

DATA_FILE = os.getenv("NOTES_FILE", "/app/data/notes.json")


def _read_notes():
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def _write_notes(notes):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

    temp_file = DATA_FILE + ".tmp"

    with open(temp_file, "w", encoding="utf-8") as file:
        json.dump(notes, file, indent=2)

    os.replace(temp_file, DATA_FILE)


def get_notes():
    return _read_notes()


def create_note(title, content):
    notes = _read_notes()

    now = datetime.now(timezone.utc).isoformat()

    note = {
        "id": str(uuid.uuid4()),
        "title": title,
        "content": content,
        "created_at": now,
        "updated_at": now,
    }

    notes.append(note)
    _write_notes(notes)

    return note


def update_note(note_id, title, content):
    notes = _read_notes()

    for note in notes:
        if note["id"] == note_id:
            note["title"] = title
            note["content"] = content
            note["updated_at"] = datetime.now(timezone.utc).isoformat()

            _write_notes(notes)
            return note

    return None


def delete_note(note_id):
    notes = _read_notes()

    updated_notes = [note for note in notes if note["id"] != note_id]

    if len(updated_notes) == len(notes):
        return False

    _write_notes(updated_notes)
    return True