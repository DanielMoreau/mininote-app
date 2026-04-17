let notes: { id: string; content: string }[] = []

export const fakeDb = {
  getNotes: () => notes,

  addNote: (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      content,
    }
    notes = [newNote, ...notes]
  },

  deleteNote: (id: string) => {
    notes = notes.filter((n) => n.id !== id)
  },
}