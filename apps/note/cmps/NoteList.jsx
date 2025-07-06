import { NotePreview } from "../cmps/NotePreview.jsx";
import { NoteActions } from "./NoteActions.jsx";
import { ColorInput } from "./ColorInput.jsx";

const { Link } = ReactRouterDOM
const { useState } = React

export function NoteList({ notes, onRemoveNote, onColorChange }) {
    const [openColorPickerId, setOpenColorPickerId] = useState(null)
    if (!notes.length) return <div>No Notes To Show...</div>

    function toggleColorPicker(noteId) {
        if (openColorPickerId === noteId) {
            setOpenColorPickerId(null)
        } else {
            setOpenColorPickerId(noteId)
        }
    }

    return (
        <div className="note-grid">
            {notes.map(note =>
                <article key={note.id} className={`note-card ${openColorPickerId === note.id ? 'color-picker-open' : ''}`}
                    style={note.style}>
                    <div className="note-card-inner">
                        <NotePreview note={note} />
                        {/*render NotePreview cmp, passing curr note obj as a prop for display*/}

                        <NoteActions
                            onRemove={() => onRemoveNote(note.id)}
                            toggleColorPicker={() => toggleColorPicker(note.id)}
                            isColorInputOpen={openColorPickerId === note.id}
                        />
                    </div>
                    {openColorPickerId === note.id && (
                        <div className="color-picker-popup">
                            <ColorInput
                                onSetNoteStyle={(style) => onColorChange(note.id, style.backgroundColor)}
                            />
                        </div>
                    )}

                </article>
            )}
        </div>
    )

}


