"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  content: string;
  pinned: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!content) return;

    await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content })
    });

    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, {
      method: "DELETE"
    });

    fetchNotes();
  };

  const togglePinned = async (id: string) => {
    await fetch("/api/notes", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    fetchNotes();
  };

  return (
    <main
      style={{
        padding: 20,
        background: darkMode ? "#111" : "#fff",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        transition: "all 0.2s ease"
      }}
    >
      <h1>MiniNote Cloud ☁️</h1>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nouvelle note..."
          style={{
            padding: 8,
            marginRight: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000"
          }}
        />
        <button onClick={addNote}>Ajouter</button>
      </div>

      <ul>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: 10 }}>
            {note.pinned ? "📌 " : ""}
            {note.content}

            <button
              onClick={() => togglePinned(note.id)}
              style={{ marginLeft: 10 }}
            >
              Toggle
            </button>

            <button
              onClick={() => deleteNote(note.id)}
              style={{ marginLeft: 5 }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}