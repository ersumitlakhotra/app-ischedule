import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

const colors = [
  "bg-yellow-200",
  "bg-pink-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-purple-200",
];

const StickyNotes =() => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("floating-notes"));
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("floating-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "New Note...",
      x: 150,
      y: 150,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setNotes([...notes, newNote]);
  };

  const updateText = (id, value) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text: value } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updatePosition = (id, data) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, x: data.x, y: data.y } : n
    ));
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">

      {/* Add Button */}
      <button
        onClick={addNote}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 px-5 py-3 rounded-full shadow-lg font-semibold z-50"
      >
        + Add Note
      </button>

      {notes.map(note => {
        const nodeRef = React.createRef(); // IMPORTANT FIX

        return (
          <Draggable
            key={note.id}
            nodeRef={nodeRef}
            position={{ x: note.x, y: note.y }}
            onStop={(e, data) => updatePosition(note.id, data)}
          >
            <div
              ref={nodeRef}
              className={`${note.color} w-64 min-h-[150px] p-4 rounded-2xl shadow-xl absolute cursor-move`}
            >
              {/* Delete */}
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-3 text-gray-600 hover:text-red-500"
              >
                ✕
              </button>

              <textarea
                value={note.text}
                onChange={(e) => updateText(note.id, e.target.value)}
                className="w-full min-h-[150px] bg-transparent  resize-none outline-none mt-6"
              />
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

export default StickyNotes
