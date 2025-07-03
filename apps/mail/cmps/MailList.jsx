import { MailPreview } from "./MailPreview.jsx";

const { Link, useNavigate, useLocation } = ReactRouterDOM
const { useState, useEffect } = React

export function MailList({ mails, onRemoveMail, onToggleReadStatus, onToggleStarred, onReplyClick }) {

    const navigate = useNavigate()
    // const location = useLocation()

    function onPreviewClick(mailId) {
        console.log('mailId', mailId)
        navigate(`/mail/${mailId}`)
    }

    return (
        <section className="mail-list">
            <header className="mail-list-header">
                <div className="header-star"></div>
                <div className="header-from">From</div>
                <div className="header-topic">Topic</div>
                <div className="header-time">Time</div>
            </header>
            <div className="mail-items">
                {mails.map(mail =>
                
                    <MailPreview key={mail.id} mail={mail}
                        onClick={() => onPreviewClick(mail.id)}
                        onToggleStarred={onToggleStarred}
                        onToggleReadStatus={onToggleReadStatus} 
                        onRemoveMail={onRemoveMail}
                        onReplyClick={onReplyClick} />
                    /* {!location.pathname.includes('add') ?
                        <section className="btns">
                            <button onClick={() => onRemoveMail(mail.id)}>
                                Remove
                            </button>
                            <Link to={`/mail/${mail.id}`}>
                                <button>Details</button>
                            </Link>
                            <Link to={`/mail/edit/${mail.id}`}>
                                <button>Edit</button>
                            </Link>
                        </section> :
                        <section>
                            <button onClick={() => onAddMail(mail.id)}>Add mail</button>
                        </section>
                    } */
                )}
            </div>
        </section>
    )

}