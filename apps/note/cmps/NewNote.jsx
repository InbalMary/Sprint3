import { noteService } from '../services/note.service.js'

const { useState, useRef } = React

export function NewNote({ onAddNote }) {
    const [isPinned, setIsPinned] = useState(false)
    const titleRef = useRef() //creates a ref obj and assigns it to titleRef. it will later refer to the DOM element of title
    const txtRef = useRef()

    function onSaveNote() {
        const title = titleRef.current.innerText // get text content from title div
        const txt = txtRef.current.innerText
        console.log('Saving note:', title, txt)

        const newNote = noteService.getEmptyNote()
        newNote.info.title = title
        newNote.info.txt = txt

        onAddNote(newNote) //pass new note to parent NoteIndex

        //reset:
        titleRef.current.innerText = ''
        txtRef.current.innerText = ''
        setIsPinned(false)
    }

    return (
        <div className="new-note-container note-preview" style={{ position: 'relative' }}>
            <div ref={titleRef}
                className="new-note-title"
                contentEditable="true"
                data-placeholder="Title">
            </div>
            <p ref={txtRef}
                className="new-note-txt"
                contentEditable="true"
                data-placeholder="Take a note...">

            </p>
            <span className={`note-pin ${isPinned ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                    viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                </svg>
            </span>  {/*add pin functionality later*/}
            <button className="save btn" onClick={onSaveNote}>Save</button>
        </div>
    )
}