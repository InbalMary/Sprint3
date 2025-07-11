import { noteService } from '../services/note.service.js'
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { NoteForm } from '../cmps/NoteForm.jsx'
import { NoteHeader } from '../cmps/NoteHeader.jsx'
import { NoteSidebar } from '../cmps/NoteSidebar.jsx'


const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(noteService.getFilterFromSearchParams(searchParams))//if it's in url it's seen in the input and filtered results (one way data binding)
    const [editedNoteId, setEditedNoteId] = useState(null) //track which note is being edited

    useEffect(() => {
        loadNotes()
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

    function onEditNote(note, onClose) {
        if (!note || !note.info) {
            console.warn('Invalid note passed to onEditNote:', note)
            return
        }
        const { id: noteId, info, style, isPinned } = note
        const { title, txt } = info

        noteService.get(noteId)
            .then(noteToEdit => {
                noteToEdit.info.title = title
                noteToEdit.info.txt = txt
                noteToEdit.style = style
                noteToEdit.isPinned = isPinned

                return noteService.save(noteToEdit)
            })
            .then(() => {
                setEditedNoteId(null)
                loadNotes()
                if (onClose) onClose()
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem editing note')
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

    function togglePin(noteId) {
        noteService.get(noteId)
            .then(note => {
                note.isPinned = !note.isPinned
                return noteService.save(note)
            })
            .then(() => {
                loadNotes()
            })
            .catch(err => {
                console.log('Error toggling pin:', err)
                showErrorMsg('Could not toggle pin')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!notes) return <div>Loading...</div>

    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    return (
        <section className="container">
            <section className="note-index">
                <NoteHeader>
                    <NoteFilter
                        defaultFilter={filterBy}
                        onSetFilter={onSetFilter}
                    />
                </NoteHeader>
                <NoteSidebar />
                <NoteForm onAddNote={onAddNote} />
                <div style={{ marginTop: pinnedNotes.length > 0 ? '0' : '2rem' }}></div>
                {pinnedNotes.length > 0 && (
                    <div className="pinned-notes-section">
                        <h6>Pinned</h6>
                        <NoteList notes={pinnedNotes}
                            onRemoveNote={onRemoveNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                        />
                    </div>
                )}
                {otherNotes.length > 0 && (
                    <div className="other-notes-section" >
                        {pinnedNotes.length > 0 && <h6>Others</h6>}
                        <NoteList notes={otherNotes}
                            onRemoveNote={onRemoveNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                        />
                    </div>
                )}
                {editedNoteId && (
                    <div className="editor-overlay" onClick={() => setEditedNoteId(null)}>
                        <div onClick={ev => ev.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '580px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                            <NoteForm
                                note={notes.find(note => note.id === editedNoteId)}
                                onSave={onEditNote}
                                onClose={() => setEditedNoteId(null)}
                                onSetNoteStyle={(style) => {
                                    onColorChange(editedNoteId, style.backgroundColor)
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>
        </section>
    )

}






