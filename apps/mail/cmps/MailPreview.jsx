import { utilService } from '../../../services/util.service.js'

const { useState, useEffect } = React

export function MailPreview({ mail, onClick, onToggleStarred, onToggleReadStatus, onRemoveMail, onReplyClick}) {

    const [starred, setStarred] = useState(mail.isStared)
    const [isHovered, setIsHovered] = useState(false)
    const { subject, body, isRead, sentAt, from } = mail

    const onToggleStar = (ev) => {
        ev.stopPropagation()
        setStarred(starred => !starred)
        onToggleStarred(mail.id)
    }
    return (
        <section onClick={onClick} className={`mail-preview ${isRead ? 'read' : 'unread'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* <pre>{JSON.stringify(mail, null, 2)}</pre> */}
            <div className="star-cell">
                <p className={`star ${starred ? 'starred' : ''}`}
                    onClick={(ev) => onToggleStar(ev)}>
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

            {isHovered && (
                <div className="action-buttons">
                    <button onClick={(ev) => onToggleReadStatus(mail.id, ev)}>
                        {isRead ? <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h404q-4 20-4 40t4 40H160l320 200 146-91q14 13 30.5 22.5T691-572L480-440 160-640v400h640v-324q23-5 43-14t37-22v360q0 33-23.5 56.5T800-160H160Zm0-560v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="m480-920 362 216q18 11 28 30t10 40v434q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200v-434q0-21 10-40t28-30l362-216Zm0 466 312-186-312-186-312 186 312 186Zm0 94L160-552v352h640v-352L480-360Zm0 160h320-640 320Z"/></svg>}
                    </button>
                    <button onClick={(ev) => onRemoveMail(mail.id, ev)}><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    <button onClick={(ev) => onReplyClick(mail.id, ev)}><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"/></svg></button>
                </div>
            )}
        </section>
    )
}