import { NotePreview } from "../cmps/NotePreview.jsx";

const { Link } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onSelectNoteId }) {
    if (!notes.length) return <div>No Notes To Show...</div>

    return (
        <div className="note-grid">
            {notes.map(note =>
                <article key={note.id} className="note-card" style={note.style}>
                    <NotePreview note={note} />
                    {/*render NotePreview cmp, passing curr note obj as a prop for display*/}
                    <div className="note-actions">
                        <button onClick={() => onRemoveNote(note.id)} >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                        </button>
                        {/* <Link to={`/note/edit/${note.id}`}>
                            <button>Edit</button>
                        </Link> */}

                    </div>
                </article>
            )}
        </div>
    )

}


