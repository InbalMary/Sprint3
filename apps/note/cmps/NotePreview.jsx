
export function NotePreview({ note }) {
    const { info, style, isPinned, type } = note

    return (
        <article className="note-preview" style={style}>
            {isPinned && (
                <span className="note-pin">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                    </svg>
                    {/* <img src="/assets/icons/notes/pin.svg" className="pin" /> */}
                </span>
            )}
            <h3>{info.title || 'Title'}</h3>
            <p>{info.txt || 'Take a note...'}</p>
        </article>
    )
}