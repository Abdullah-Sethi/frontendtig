import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
      setError("");
    } catch {
      setError("Backend is not available yet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function saveNote(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const note = { title, content };
    const url = editingId ? `/api/notes/${editingId}` : "/api/notes";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });

      if (!response.ok) throw new Error("Failed to save note");

      setTitle("");
      setContent("");
      setEditingId(null);
      await loadNotes();
    } catch {
      setError("Unable to save note. Is the backend running?");
    }
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  }

  async function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");
      await loadNotes();
    } catch {
      setError("Unable to delete note.");
    }
  }

  function cancelEdit() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <h1>Notes</h1>
            <p>Your personal workspace</p>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="editor">
          <h2>{editingId ? "Edit note" : "Create a note"}</h2>

          <form onSubmit={saveNote}>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />

            <textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />

            <div className="form-actions">
              {editingId && (
                <button type="button" className="cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="save">
                {editingId ? "Update note" : "Save note"}
              </button>
            </div>
          </form>
        </section>

        <section className="notes-section">
          <div className="section-heading">
            <h2>Your notes</h2>
            <span>{notes.length} notes</span>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && <p className="empty">Loading notes...</p>}

          {!loading && notes.length === 0 && (
            <div className="empty">
              <p>No notes yet.</p>
              <span>Create your first note above.</span>
            </div>
          )}

          <div className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <div className="note-actions">
                  <button onClick={() => editNote(note)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
