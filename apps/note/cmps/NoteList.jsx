import { NotePreview } from "../cmps/NotePreview.jsx";

const { Link } = ReactRouterDOM
const { useState } = React

export function NoteList({ notes, onRemoveNote, onColorChange, onTogglePin, onEditNote, editedNoteId, setEditedNoteId }) {
    const [openColorPickerId, setOpenColorPickerId] = useState(null)
    if (!notes.length) return <div>No Notes To Show...</div>

    // Sort notes to show pinned ones first
    const sortedNotes = [...notes].sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Then sort by creation date (newest first) or any other criteria
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    function toggleColorPicker(noteId) {
        if (openColorPickerId === noteId) {
            setOpenColorPickerId(null)
        } else {
            setOpenColorPickerId(noteId)
        }
    }
    //add later stop propagation
    return (
        <div className="note-grid">
            {sortedNotes.map(note =>
                <article key={note.id} className={`note-card ${openColorPickerId === note.id ? 'color-picker-open' : ''}`}
                    style={note.style}
                    onClick={() => setEditedNoteId(note.id)}
                >
                    <div className="note-card-inner">
                        <NotePreview
                            note={note}
                            onEditNote={onEditNote}
                            isEditing={editedNoteId === note.id}
                            onSelectNote={() => setEditedNoteId(note.id)}
                            onTogglePin={() => onTogglePin(note.id)}
                            onRemoveNote={(id) => onRemoveNote(id)}
                            toggleColorPicker={(ev) => {

                                toggleColorPicker(note.id);
                            }}
                            isColorInputOpen={openColorPickerId === note.id}
                        />
                    </div>
                </article>
            )}
        </div>
    )

}


