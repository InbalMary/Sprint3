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
    const [clickedBtn, setClickedBtn] = useState('bulb')

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

    // Filter notes based on sidebar clickedBtn
    function getNotesToShow() {
        if (!notes) return []
        if (clickedBtn === 'bulb') {
            return notes.filter(note => !note.isArchived && !note.isBinned)
        }
        if (clickedBtn === 'archive') {
            return notes.filter(note => note.isArchived && !note.isBinned)
        }
        if (clickedBtn === 'bin') {
            return notes.filter(note => note.isBinned)
        }
        return []
    }

    const notesToShow = getNotesToShow()

    const pinnedNotes = notesToShow.filter(note => note.isPinned)
    const otherNotes = notesToShow.filter(note => !note.isPinned)

    function onRemoveNote(noteId) { //permanently delete
        if (!noteId) return
        console.log('Removing note with id:', noteId)
        noteService.remove(noteId)
            .then(() => {
                showSuccessMsg('Note was permanently deleted!')
                setNotes(notes => notes.filter(note => note.id !== noteId))
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem deleting note')
            })
    }

    function onEmptyBin() {
        noteService.query().then(allNotes => {
            const binnedNotes = allNotes.filter(note => note.isBinned)
            console.log('Binned notes to delete:', binnedNotes.length)

            if (binnedNotes.length === 0) {
                showSuccessMsg('Bin is already empty.')
                return
            }

            if (!window.confirm('Are you sure you want to permanently delete all notes in the bin?')) {
                return
            }

            // Delete all binned notes one by one
            Promise.all(binnedNotes.map(note => noteService.remove(note.id)))
                .then(() => {
                    showSuccessMsg('Bin emptied successfully!')
                    loadNotes() // reload notes after deletion
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Could not empty bin.')
                })
        })
    }


    function onBinNote(noteId) {
        noteService.binNote(noteId)
            .then(() => {
                showSuccessMsg('Note moved to bin!')
                loadNotes()
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem moving note to bin')
            })
    }

    function onArchiveNote(noteId) {
        noteService.archiveNote(noteId)
            .then(() => {
                showSuccessMsg('Note archived!')
                loadNotes()
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem archiving note')
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
    return (
        <section className="container">
            <section className="note-index">
                <NoteHeader clickedBtn={clickedBtn}>
                    <NoteFilter
                        defaultFilter={filterBy}
                        onSetFilter={onSetFilter}
                    />
                </NoteHeader>

                {/* Pass clickedBtn and setClickedBtn to NoteSidebar */}
                <NoteSidebar clickedBtn={clickedBtn} setClickedBtn={setClickedBtn} />

                {/* Show NoteForm only on main notes view */}
                {clickedBtn === 'bulb' && <NoteForm onAddNote={onAddNote} />}

                {/* Render notes depending on selected btn */}
                {clickedBtn === 'bulb' && pinnedNotes.length > 0 && (
                    <div className="pinned-notes-section">
                        <h6>Pinned</h6>
                        <NoteList
                            notes={pinnedNotes}
                            onBinNote={onBinNote}
                            onArchiveNote={onArchiveNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                            isInBin={false}
                        />
                    </div>
                )}

                {(clickedBtn === 'bulb' && otherNotes.length > 0) && (
                    <div className="other-notes-section">
                        {pinnedNotes.length > 0 && <h6>Others</h6>}
                        <NoteList
                            notes={otherNotes}
                            onBinNote={onBinNote}
                            onArchiveNote={onArchiveNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                            isInBin={false}
                        />
                    </div>
                )}

                {/* Show bin or archive notes as a simple list without sections */}
                {clickedBtn === 'bin' && (
                    <section className="bin-section">
                        <button className="empty-bin" onClick={onEmptyBin}>Empty bin</button>
                        <NoteList
                            notes={notesToShow}
                            onRemoveNote={onRemoveNote}
                            onBinNote={onBinNote}
                            onArchiveNote={onArchiveNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                            isInBin={clickedBtn === 'bin'}
                        />
                    </section>
                )}
                {clickedBtn === 'archive' && (
                    <section className="archive-section">
                        <NoteList
                            notes={notesToShow}
                            onBinNote={onBinNote}
                            onColorChange={onColorChange}
                            editedNoteId={editedNoteId}
                            setEditedNoteId={setEditedNoteId}
                            onEditNote={onEditNote}
                            onTogglePin={togglePin}
                            isInBin={false}
                        />
                    </section>
                )}
                {/* Editor overlay code remains the same */}
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






