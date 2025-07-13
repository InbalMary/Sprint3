import { NotePreview } from "../cmps/NotePreview.jsx";

const { useState } = React

export function NoteList({ notes, onRemoveNote, onBinNote, onArchiveNote, onColorChange, onTogglePin, onEditNote, editedNoteId, setEditedNoteId, isInBin }) {
    const [openColorPickerId, setOpenColorPickerId] = useState(null)
    if (!notes.length) return <div>No Notes To Show...</div>

    // Sort notes to show pinned first
    const sortedNotes = [...notes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // newest first
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    function toggleColorPicker(noteId) {
        if (openColorPickerId === noteId) {
            setOpenColorPickerId(null)
        } else {
            setOpenColorPickerId(noteId)
        }
    }
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
                            onBinNote={onBinNote}
                            isInBin={isInBin}
                            onArchiveNote={() => onArchiveNote(note.id)}
                            onColorChange={(newColor) => onColorChange(note.id, newColor)}
                            toggleColorPicker={(ev) => {
                                ev.stopPropagation()
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


