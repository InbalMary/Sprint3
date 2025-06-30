import { utilService } from '../../../services/util.service.js'

const { useState, useEffect } = React

export function MailPreview({ mail, onClick }) {

    const [starred, setStarred] = useState(mail.isStared)

    const { subject, body, isRead, sentAt, from } = mail
    
    const onToggleStar = () => {
        setStarred(starred => !starred)
    }
    return (
        <tr onClick={onClick} className={`mail-preview ${isRead ? 'read' : 'unread'}`}>
            {/* <pre>{JSON.stringify(mail, null, 2)}</pre> */}
            <td className="star-cell">
                <span className={`star ${starred ? 'starred' : ''}`}
                    onClick={onToggleStar}>
                    {starred ? '★' : '☆'}
                </span>
            </td>
            <td className="from-cell">{from.slice(0, from.indexOf('@'))}</td>
            <td className="subject-cell">
                <span className="subject">{subject}</span>
                <span> - </span>
                <span className="body-content">{body.slice(0, 80)}...</span>
            </td>
            <td className="time-cell">{utilService.formatTimestamp(sentAt)}</td>
        </tr>
    )
}