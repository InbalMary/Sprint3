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

    function onAddNote(newNote) {
        noteService.save(newNote).then(() => {
            loadNotes()
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
                />
            </section>
        </section>
    )

}






