export function NotePreview({ note }) {
    const { info, style, isPinned, type } = note

    return (
        <article className="note-preview" style={style}>
            <span className="note-pin">{isPinned ? 'Pin-icon' : ''}</span>
            <h3>{info.title || 'Title'}</h3>
            <p>{info.txt || 'Take a note...'}</p>
        </article>
    )
}