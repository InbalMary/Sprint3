import { ColorInput } from '../cmps/ColorInput.jsx'
import { NotePin } from './NotePin.jsx'
import { utilService } from '../../../services/util.service.js'

const { useState, useEffect, useRef } = React

export function NoteForm({ note, onSave, onClose, onAddNote, onSetNoteStyle, onTogglePin, onArchiveNote }) {
    const titleRef = useRef()
    const txtRef = useRef()
    const newFormRef = useRef(null)
    const colorInputRef = useRef(null)

    const [noteStyle, setNoteStyle] = useState({ backgroundColor: '#ffffff' })
    const [isColorInputOpen, setIsColorInputOpen] = useState(false);
    const [cmpType, setCmpType] = useState('color')
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPinned, setIsPinned] = useState(false);
    const [textPlaceholder, setTextPlaceholder] = useState('Take a note...')

    const isEdit = note && note.id ? true : false //editing or creating

    useEffect(() => {
        if (isEdit) {
            setIsPinned(note.isPinned)
            setNoteStyle(note.style || { backgroundColor: '#ffffff' })
            titleRef.current.innerText = note.info.title || ''
            txtRef.current.innerHTML = note.info.txt || ''
            // Set cursor focus immediately to txt
            txtRef.current.focus()
        } else {
            // Reset for new note
            setIsPinned(false)
            setNoteStyle({ backgroundColor: '#ffffff' })
            if (titleRef.current) titleRef.current.innerText = ''
            if (txtRef.current) txtRef.current.innerText = ''
            setIsColorInputOpen(false)
        }
    }, [note, isEdit])  // Run effect when note data or edit mode changes

    useEffect(() => {
        function handleClickOutside(event) {
            // Collapse new note form when clicking outside of it. check if expanded form was rendered
            if (newFormRef.current && !newFormRef.current.contains(event.target)) {
                if (!isEdit && isExpanded) {
                    setIsExpanded(false)
                }
                setCmpType('text')
            }
            if (isColorInputOpen && colorInputRef.current && !colorInputRef.current.contains(event.target)) {
                setIsColorInputOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isEdit, isExpanded, isColorInputOpen]
    )

    useEffect(() => {
        if (!isEdit && isExpanded) {
            txtRef.current.focus()
        }
    }, [isEdit, isExpanded])

    // useEffect(() => {
    //     if (isEdit && (note.type === 'NoteImg' || note.type === 'NoteVideo') && titleRef.current) {
    //         if (titleRef.current.innerText.trim() === '') {
    //             titleRef.current.innerText = '<br>'
    //         }
    //         titleRef.current.focus()
    //     }
    // }, [isEdit, note.type])

    useEffect(() => {
        let placeholderText
        if (cmpType === 'image') placeholderText = 'Paste image URL'
        else if (cmpType === 'video') placeholderText = 'Paste video URL'
        else if (cmpType === 'list') placeholderText = 'Enter comma separated list'
        else if (cmpType === 'text') placeholderText = 'Take a note...'
        else placeholderText = 'Take a note...'
        setTextPlaceholder(placeholderText)
    }, [cmpType])

    function handleSetNoteStyle(newStyle) {
        console.log('newStyle:', newStyle)
        setNoteStyle(prevStyle => {
            const updatedStyle = { ...prevStyle, ...newStyle }
            if (onSetNoteStyle) onSetNoteStyle(updatedStyle) //notify parent
            return updatedStyle
        })
    }
    //TODO: remove log after fixed
    function toggleColorInput() {
        console.log('toggleColorInput called')
        setCmpType('color')
        setIsColorInputOpen(prev => {
            console.log('previous isColorInputOpen:', prev)
            return !prev
        })
    }

    function togglePin() {
        console.log('Pin toggled!')
        if (isEdit) {
            // Inform parent to toggle pin state in the global notes list
            if (onTogglePin) {
                onTogglePin(note.id)
                setIsPinned(prev => !prev)
            }
        } else {
            // For new note, toggle local pin state
            setIsPinned(prev => !prev)
        }
    }

    const typeMap = {
        text: 'NoteTxt',
        image: 'NoteImg',
        video: 'NoteVideo',
        color: 'NoteTxt',
        list: 'NoteList'
    }

    function getNoteType(cmpType = 'text') {
        return typeMap[cmpType] || 'NoteTxt'
    }

    function formatUrlToHtml(cmpType, url) {
        return utilService.formatUrlToHtml(cmpType, url)
    }

    function handleSave() {
        const title = titleRef.current.innerText || '' // get text content from title div
        let contentHTML = txtRef.current.innerHTML || ''
        if (cmpType === 'list') {
            const listText = txtRef.current.innerText || ''
            const items = listText.split(',').map(item => item.trim()).filter(item => item)
            contentHTML = `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`
        }
        if (isEdit) {
            onSave({
                id: note.id,
                info: {
                    title,
                    txt: contentHTML,
                },
                style: noteStyle,
                isPinned,
                type: note.type,
            }, onClose)
        } else {
            onAddNote({
                title,
                txt: contentHTML,
                style: noteStyle,
                isPinned,
                type: getNoteType(cmpType),
            })
            //reset:
            titleRef.current.innerText = ''
            txtRef.current.innerHTML = ''
            setNoteStyle({ backgroundColor: 'white' })
            setIsPinned(false)
            setIsColorInputOpen(false)
            setCmpType('text')
            // Add empty class back to show placeholders
            if (titleRef.current) titleRef.current.classList.add('empty')
            if (txtRef.current) txtRef.current.classList.add('empty')
        }
    }

    function handleAddUrlToNote(url) {
        if (!txtRef.current) return
        const htmlSnippet = formatUrlToHtml(cmpType, url)
        txtRef.current.innerHTML += htmlSnippet
        setCmpType('text') //reset
    }

    //TODO: check if Redundant
    function DynamicCmp(props) {
        const dynamicCmpMap = {
            color: <ColorInput {...props} />,
            image: null,
            video: null
        }
        return dynamicCmpMap[props.cmpType]
    } // returns the component to be rendered.

    function handleInput(ev) { //if user deletes typed text, placeholder returns
        const elInput = ev.target
        if (elInput.textContent.trim() === '') {
            elInput.classList.add('empty')
        } else {
            elInput.classList.remove('empty')
        }
    }

    function handlePaste(ev) {
        const paste = (ev.clipboardData || window.clipboardData).getData('text')
        if (!paste) return

        ev.preventDefault()

        let pasteType = 'text'
        if (/\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i.test(paste)) pasteType = 'image'
        else if (/youtube|vimeo/.test(paste)) pasteType = 'video'

        if (txtRef.current) {
            const html = utilService.formatUrlToHtml(pasteType, paste)
            txtRef.current.innerHTML += html
        }

        setCmpType(pasteType) // update UI type afterwards
    }

    function handleExpand() {
        setIsExpanded(true)
    }

    function handleArchive() {
        if (isEdit) {
            onArchiveNote(note.id)
            onClose()
        } else {
            onAddNote({
                title: titleRef.current.innerText,
                txt: txtRef.current.innerHTML,
                style: noteStyle,
                isPinned,
                type: getNoteType(cmpType),
                isArchived: true
            })
            setIsExpanded(false)
        }
    }

    // show collapsed line if new note and not expanded
    if (!isEdit && !isExpanded) {
        return <div className="note-container collapsed-note" onClick={handleExpand}
        >Take a note...
            <div className="note-toolbar">
                <button className="new-list btn"
                    onClick={(ev) => {
                        console.log('List button clicked')
                        ev.stopPropagation()
                        setCmpType('list')
                        setIsExpanded(true)
                    }}
                    title="New list">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="currentColor">
                        <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                    </svg>
                </button>
                {/* <button className="draw-note btn" title="New note with drawing">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="currentColor">
                        <path d="M240-120q-45 0-89-22t-71-58q26 0 53-20.5t27-59.5q0-50 35-85t85-35q50 0 85 35t35 85q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 23-5.5 42T220-202q5 2 10 2h10Zm230-160L360-470l358-358q11-11 27.5-11.5T774-828l54 54q12 12 12 28t-12 28L470-360Zm-190 80Z" /></svg>
                </button> */}
                <button className="img-note btn"
                    title="New note with image"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        setCmpType('image')
                        setIsExpanded(true)
                        txtRef.current.focus()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="currentColor">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                    </svg>
                </button>
                <button className="video-note btn"
                    title="New note with video"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        setCmpType('video')
                        setIsExpanded(true)
                        txtRef.current.focus()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="currentColor">
                        <path d="M616-242q-27 1-51.5 1.5t-43.5.5h-41q-71 0-133-2-53-2-104.5-5.5T168-257q-26-7-45-26t-26-45q-6-23-9.5-56T82-447q-2-36-2-73t2-73q2-30 5.5-63t9.5-56q7-26 26-45t45-26q23-6 74.5-9.5T347-798q62-2 133-2t133 2q53 2 104.5 5.5T792-783q26 7 45 26t26 45q6 23 9.5 56t5.5 63q2 36 2 73v17q-19-8-39-12.5t-41-4.5q-83 0-141.5 58.5T600-320q0 21 4 40.5t12 37.5ZM400-400l208-120-208-120v240Zm360 200v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
                    </svg>
                </button>
            </div>

        </div >
    }
    // Full note form — either editing or new note expanded
    return (
        <div ref={newFormRef} className={`note-container note-base ${isEdit ? 'note-editor' : 'new-note-container'}`} style={noteStyle}>
            <div
                ref={titleRef}
                className={`note-editable note-title ${!isEdit ? 'empty' : ''}`}
                contentEditable="true"
                data-placeholder="Title"
                suppressContentEditableWarning={true}
                onInput={handleInput}>
            </div>
            <p
                ref={txtRef}
                className={`note-editable note-text ${!isEdit ? 'empty' : ''}`}
                contentEditable="true"
                data-placeholder={textPlaceholder}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onPaste={handlePaste}
            >
            </p>
            <NotePin isPinned={isPinned} onTogglePin={togglePin} />

            <div className="note-footer">

                <div className="note-toolbar">
                    {/* <button className="formatting btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="currentColor">
                            <path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z" />
                        </svg>
                    </button> */}
                    <button className="background btn" title="Background options" onClick={(ev) => {
                        ev.stopPropagation()
                        toggleColorInput()
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z" />
                        </svg>
                    </button>
                    {/* <button className="reminders btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M440-360h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>
                    </button> */}
                    {/* <button className="add-contact btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" /></svg>
                    </button> */}
                    <button
                        className="img-note btn"
                        title="Add image"
                        onClick={() => {
                            setCmpType('image')
                            if (txtRef.current) {
                                txtRef.current.innerText = ''
                                txtRef.current.classList.add('empty')
                                txtRef.current.focus()

                            }
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                        </svg>
                    </button>

                    <button
                        className="video-note btn"
                        title="Add video"
                        onClick={() => {
                            setCmpType('video')
                            if (txtRef.current) {
                                txtRef.current.innerText = ''
                                txtRef.current.classList.add('empty')
                                txtRef.current.focus()
                            }
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M616-242q-27 1-51.5 1.5t-43.5.5h-41q-71 0-133-2-53-2-104.5-5.5T168-257q-26-7-45-26t-26-45q-6-23-9.5-56T82-447q-2-36-2-73t2-73q2-30 5.5-63t9.5-56q7-26 26-45t45-26q23-6 74.5-9.5T347-798q62-2 133-2t133 2q53 2 104.5 5.5T792-783q26 7 45 26t26 45q6 23 9.5 56t5.5 63q2 36 2 73v17q-19-8-39-12.5t-41-4.5q-83 0-141.5 58.5T600-320q0 21 4 40.5t12 37.5ZM400-400l208-120-208-120v240Zm360 200v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
                        </svg>
                    </button>
                    <button className="archive-note btn" title="Archive" onClick={handleArchive}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />
                        </svg>
                    </button>
                    {/* <button className="more-features btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                        </svg>
                    </button> */}
                    {/* <button className="undo btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
                        </svg>
                    </button>
                    <button className="redo btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
                        </svg>
                    </button> */}
                </div>
                {isColorInputOpen && (
                    <div ref={colorInputRef} className="color-picker-popup" onClick={ev => ev.stopPropagation()}>
                        <DynamicCmp
                            cmpType={cmpType}
                            onSetNoteStyle={handleSetNoteStyle}
                            onAddUrlToNote={handleAddUrlToNote}
                        />
                    </div>
                )}
                <button className="save btn" onClick={handleSave}>Close</button>
            </div>
        </div>

    )

}