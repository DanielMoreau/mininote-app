"use client"

import { useEffect, useMemo, useState } from "react"

type Note = {
  id: string
  content: string
  pinned: boolean
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [dark, setDark] = useState(false)

  // 🔄 fetch notes
  const fetchNotes = async () => {
    const res = await fetch("/api/notes")
    const data = await res.json()
    setNotes(data)
  }

  useEffect(() => {
    fetchNotes()

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") setDark(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  // ➕ add
  const addNote = async () => {
    if (!content.trim()) return

    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })

    setContent("")
    fetchNotes()
  }

  // ❌ delete
  const deleteNote = async (id: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    fetchNotes()
  }

  // ✏️ edit
  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setContent(note.content)
  }

  const saveEdit = async () => {
    const note = notes.find((n) => n.id === editingId)

    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        content,
        pinned: note?.pinned,
      }),
    })

    setEditingId(null)
    setContent("")
    fetchNotes()
  }

  // 📌 pin
  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id)

    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        content: note?.content,
        pinned: !note?.pinned,
      }),
    })

    fetchNotes()
  }

  // 🔍 filtre + tri
  const filteredNotes = useMemo(() => {
    return [...notes]
      .filter((n) =>
        n.content.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [notes, search])

  return (
    <div style={dark ? styles.pageDark : styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>☁️ MiniNote Cloud</h1>

        {/* 🌙 toggle */}
        <button onClick={() => setDark(!dark)} style={styles.toggle}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🔍 search */}
        <input
          style={styles.input}
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* input */}
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Écris une note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            style={editingId ? styles.saveBtn : styles.addBtn}
            onClick={editingId ? saveEdit : addNote}
          >
            {editingId ? "💾" : "➕"}
          </button>
        </div>

        {/* list */}
        <ul style={styles.list}>
          {filteredNotes.map((note) => (
            <li
              key={note.id}
              style={{
                ...styles.card,
                background: note.pinned
                  ? dark
                    ? "#3a3000"
                    : "#fff8dc"
                  : dark
                  ? "#1a1a1a"
                  : "white",
              }}
            >
              <span>
                {note.pinned ? "📌 " : ""}
                {note.content}
              </span>

              <div>
                <button
                  style={styles.btn}
                  onClick={() => togglePin(note.id)}
                >
                  📌
                </button>

                <button
                  style={styles.btn}
                  onClick={() => startEdit(note)}
                >
                  ✏️
                </button>

                <button
                  style={styles.btn}
                  onClick={() => deleteNote(note.id)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// 🎨 styles
const styles = {
  page: { minHeight: "100vh", background: "#f5f5f5", padding: 20 },
  pageDark: { minHeight: "100vh", background: "#000", padding: 20, color: "white" },
  container: { maxWidth: 600, margin: "0 auto" },
  title: { textAlign: "center" as const },
  toggle: { marginBottom: 10 },
  input: { width: "100%", padding: 10, marginTop: 10 },
  row: { display: "flex", gap: 10 },
  addBtn: { padding: 10, background: "green", color: "white", border: "none" },
  saveBtn: { padding: 10, background: "blue", color: "white", border: "none" },
  list: { listStyle: "none", padding: 0, marginTop: 20 },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    border: "1px solid #ccc",
    marginBottom: 10,
  },
  btn: { marginLeft: 5, cursor: "pointer" },
}