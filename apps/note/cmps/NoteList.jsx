import { NotePreview } from "../cmps/NotePreview.jsx";

const { Link } =ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onSelectNoteId }) {
if(!notes.length) return <div>No Notes To Show...</div>

    return (
        <ul className="note-list container">
            {notes.map(note =>
                <li key={note.id} className="note-item">
                    <NotePreview note={note} />
                    {/*render NotePreview cmp, passing curr note obj as a prop for display*/}
                    <section className="note-actions">
                        <button onClick={() => onRemoveNote(note.id)} >
                            Remove
                        </button>
                        <Link to={`/note/edit/${note.id}`}>
                         <button>Edit</button>
                        </Link>
                       
                    </section>
                </li>
            )}
        </ul>
    )

}
  

