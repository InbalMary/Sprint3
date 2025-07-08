import { MailPreview } from "./MailPreview.jsx";


export function MailList({ mails, onRemoveMail, onToggleReadStatus, onToggleStarred, onReplyClick, onMailClick, onSaveEmailAsNote }) {

    return (
        <section className="mail-list">
            {/* <header className="mail-list-header">
                <div className="header-star"></div>
                <div className="header-from">From</div>
                <div className="header-topic">Topic</div>
                <div className="header-time">Time</div>
            </header> */}
            <div className="mail-items">
                {mails.map(mail =>

                    <MailPreview key={mail.id} mail={mail}
                        onClick={() => onMailClick(mail.id)}
                        onToggleStarred={onToggleStarred}
                        onToggleReadStatus={onToggleReadStatus}
                        onRemoveMail={onRemoveMail}
                        onReplyClick={onReplyClick}
                        onSaveEmailAsNote={onSaveEmailAsNote} />
                )}
            </div>
        </section>
    )

}