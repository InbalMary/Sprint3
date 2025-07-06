import { noteService } from '../services/note.service.js'
// import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { NewNote } from '../cmps/NewNote.jsx'
// import { getTruthyValues } from "../services/util.service.js"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))//if it's in url it's seen in the input and filtered results (one way data binding)

    useEffect(() => {
        loadNotes()
        // setSearchParams(getTruthyValues(filterBy)) //two-way data binding. whatever is typed in input filer is copied to the url
    }, [filterBy])

    function loadNotes() {
        noteService.query(filterBy)
            .then(notes => {
                console.log('Loaded notes:', notes)
                setNotes(notes)
            })
            .catch(err => console.log('err:', err))
    }

    function onRemoveNote(noteId) {
        console.log('Removing note with id:', noteId)
        noteService.remove(noteId)
            .then(() => {
                showSuccessMsg('Note was removed successfully!')
                setNotes(notes => notes.filter(note => note.id !== noteId))
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem removing note')
            })
    }

    function onAddNote({ title, txt, style, isPinned }) {
        const newNote = noteService.getEmptyNote(txt, style.backgroundColor)
        newNote.info.title = title
        newNote.info.txt = txt
        newNote.style = style
        // newNote.info.bgColor = bgColor
        newNote.isPinned = isPinned

        noteService.save(newNote)
            .then(() => {
                loadNotes()
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem adding note')
            })
    }

    function onColorChange(noteId, newColor) {
        console.log('Changing color of note:', noteId, 'to', newColor)
        noteService.get(noteId)
            .then(note => {
                note.style.backgroundColor = newColor
                return noteService.save(note)
            })
            .then(() => {
                loadNotes()
            })
            .catch(err => {
                console.log('Error changing color:', err)
                showErrorMsg('Could not change color')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!notes) return <div>Loading...</div>

    return (
        <section className="container">
            <section className="note-index">
                {/* <NoteFilter
                    defaultFilter={filterBy}
                    onSetFilter={onSetFilter}
                /> */}
                <NewNote onAddNote={onAddNote} />
                <NoteList
                    notes={notes}
                    onRemoveNote={onRemoveNote}
                    onColorChange={onColorChange}
                />
            </section>
        </section>
    )

}






