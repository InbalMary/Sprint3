
import { NoteEditor } from './NoteEditor.jsx'
const { useState, Fragment } = React

export function NotePreview({ note, onEditNote }) {
    const { info, style, isPinned, type } = note
    const [isEditing, setIsEditing] = useState(false)

    function handleSave(noteData) {
        onEditNote(noteData)
        setIsEditing(false)
    }

    return (
        <article className="note-preview" style={style}>
            <span className={`note-pin ${isPinned ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                    viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                </svg>
            </span>

            {isEditing ? (
                <NoteEditor
                    note={note}
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                />
            ) : (
                <Fragment>
                    <h3>{info.title || 'Title'}</h3>
                    <p>{info.txt || 'Take a note...'}</p>
                </Fragment>
            )}
        </article>
    )
}

