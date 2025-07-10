
import { NoteForm } from './NoteForm.jsx'
import { ColorInput } from './ColorInput.jsx'
import { NoteActions } from './NoteActions.jsx'

const { useState, useEffect, useRef, Fragment } = React

export function NotePreview({ note, onEditNote, onTogglePin, onRemoveNote }) {
    const { info, style, isPinned, type } = note
    const [isEditing, setIsEditing] = useState(false)
    const [isColorInputOpen, setIsColorInputOpen] = useState(false)
    const colorInputRef = useRef(null)


    useEffect(() => {
        function handleClickOutside(event) {
            if (isColorInputOpen && colorInputRef.current && !colorInputRef.current.contains(event.target)) {
                setIsColorInputOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isColorInputOpen]
    )

    function handleSave(noteData) {
        onEditNote(noteData)
        setIsEditing(false)
    }

    function handleSetNoteStyle(newStyle) {
        onEditNote({ ...note, style: { ...note.style, ...newStyle } })
        // setIsColorInputOpen(false)
    }

    return (

        <article className="note-preview" style={style}>
            <span className={`note-pin ${isPinned ? 'active' : ''}`}
                onClick={(ev) => {
                    ev.stopPropagation()  // prevent triggering edit/open
                    onTogglePin()
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                    viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                </svg>
            </span>

            {isEditing ? (
                <NoteForm
                    note={note}
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                    onTogglePin={onTogglePin}
                />
            ) : (
                <Fragment>
                    <h3>{info.title || 'Title'}</h3>
                    <p>{info.txt || 'Take a note...'}</p>
                    <NoteActions
                        onRemove={(ev) => {
                            ev.stopPropagation()
                            onRemoveNote(note.id)
                        }}
                        toggleColorPicker={(ev) => {
                            ev.stopPropagation()
                            setIsColorInputOpen(prev => !prev)
                            console.log('colorpicker toggled');
                        }}
                    />
                    {isColorInputOpen && (

                        <div ref={colorInputRef} className="color-picker-popup" onClick={ev => ev.stopPropagation()}>
                            <ColorInput onSetNoteStyle={handleSetNoteStyle} />
                        </div>
                    )}
                </Fragment>
            )}
        </article>
    )
}

