import { MailPreview } from "./MailPreview.jsx";
import { MailSortingHeader } from './MailSortingHeader.jsx'


export function MailList({ mails, onRemoveMail, onToggleReadStatus, onToggleStarred, onReplyClick, onMailClick, onSaveMailAsNote, filterByToEdit, handleChange, toggleSort, clearAllFilters }) {

    return (
        <section className="mail-list">
            <header className="mail-list-header">
                <MailSortingHeader
                    filterByToEdit={filterByToEdit}
                    handleChange={handleChange}
                    toggleSort={toggleSort}
                    clearAllFilters={clearAllFilters}
                />
            </header>
            <div className="mail-items">
                {mails.map(mail =>

                    <MailPreview key={mail.id} mail={mail}
                        onClick={() => onMailClick(mail.id)}
                        onToggleStarred={onToggleStarred}
                        onToggleReadStatus={onToggleReadStatus}
                        onRemoveMail={onRemoveMail}
                        onReplyClick={onReplyClick}
                        onSaveMailAsNote={onSaveMailAsNote} />
                )}
            </div>
        </section>
    )

}