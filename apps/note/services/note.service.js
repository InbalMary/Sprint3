
import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'


const NOTE_KEY = 'noteDB'
_createNotes()


export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
    getDefaultFilter,
    getFilterFromSearchParams
}


function query(filterBy = {}) {
    return storageService.query(NOTE_KEY)
        .then(notes => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                notes = notes.filter(note =>
                    regExp.test(note.info.title || '') ||
                    regExp.test(note.info.txt || '')
                )
            }
            if (filterBy.type) {
                notes = notes.filter(note => note.type === filterBy.type)
            }
            // console.log(' notes:', notes)
            return notes
        })
}

function get(noteId) {
    return storageService.get(NOTE_KEY, noteId).then(_setNextPrevNoteId)
}

function remove(noteId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTE_KEY, note)
    } else {
        return storageService.post(NOTE_KEY, note)
    }
}

function getEmptyNote(txt = '', backgroundColor = 'white') {
    return {
        id: '',
        createdAt: Date.now(),
        type: 'NoteTxt',
        isPinned: false,
        style: {
            backgroundColor
        },
        info: {
            txt
        }
    }
}

function getDefaultFilter() {
    return { txt: '', type: '' }
}


function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (!notes || !notes.length) {
        notes = [
            {
                id: utilService.makeId(),
                createdAt: Date.now() - 1000000,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#f0f8ff' },
                info: { txt: 'Welcome to your Notes app!' }
            },
            {
                id: utilService.makeId(),
                createdAt: Date.now() - 500000,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fffae6' },
                info: { txt: 'Don\'t\ forget to check your tasks.' }
            },
            {
                id: utilService.makeId(),
                createdAt: Date.now() - 300000,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e6ffe6' },
                info: {
                    title: 'Reminder',
                    txt: `Remember to water the plants in the living room.
                            The lavender needs extra care during summer.

                            Check emails for project updates.` }
            }
        ]
        utilService.saveToStorage(NOTE_KEY, notes)
    }
}


function _createNote(txt) {
    const note = getEmptyNote(txt)
    note.id = utilService.makeId()
    return note
}

function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const type = searchParams.get('type') || ''

    return {
        txt,
        type,
    }
}

function _setNextPrevNoteId(note) {
    return query().then((notes) => {
        const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
        const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
        const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
        note.nextNoteId = nextNote.id
        note.prevNoteId = prevNote.id
        return note
    })
}
