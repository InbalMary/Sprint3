import { utilService } from '../../../services/util.service.js'

const { useState, useEffect } = React

export function MailPreview({ mail, onClick, onToggleStarred }) {

    const [starred, setStarred] = useState(mail.isStared)

    const { subject, body, isRead, sentAt, from } = mail
    
    const onToggleStar = (ev) => {
        ev.stopPropagation()
        setStarred(starred => !starred)
        onToggleStarred(mail.id)
    }
    return (
        <section onClick={onClick} className={`mail-preview ${isRead ? 'read' : 'unread'}`}>
            {/* <pre>{JSON.stringify(mail, null, 2)}</pre> */}
            <div className="star-cell">
                <p className={`star ${starred ? 'starred' : ''}`}
                    onClick={(ev)=>onToggleStar(ev)}>
                    {starred ? '★' : '☆'}
                </p>
            </div>
            <div className="from-cell">{from.slice(0, from.indexOf('@'))}</div>
            <div className="subject-cell">
                <span className="subject">{subject}</span>
                <span> - </span>
                <span className="body-content">{body.slice(0, 80)}...</span>
            </div>
            <div className="time-cell">{utilService.formatTimestamp(sentAt)}</div>
        </section>
    )
}