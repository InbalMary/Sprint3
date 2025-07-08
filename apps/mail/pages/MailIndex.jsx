
import { mailService } from '../services/mail.service.js'
import { MailList } from "../cmps/MailList.jsx"
import { MailHeader } from "../cmps/MailHeader.jsx"
import { MailSidebar } from "../cmps/MailSidebar.jsx"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"
import { noteService } from '../../note/services/note.service.js'

const { Outlet, Link, useSearchParams, useNavigate, useLocation } = ReactRouterDOM
const { useState, useEffect, Fragment } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const [unreadCount, setUnreadCount] = useState(0)
    const [starredCount, setStarredCount] = useState(0)
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const isDetailsView = location.pathname.match(/^\/mail\/[^\/]+$/) &&
        !location.pathname.includes('/edit')

    useEffect(() => {
        loadMails()
        setSearchParams(utilService.getTruthyValues(filterBy))
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then((mails) => {
                setMails(mails)
                const unreadMails = mails.filter(mail => !mail.isRead).length
                setUnreadCount(unreadMails)
                const starredMails = mails.filter(mail => mail.isStared).length
                setStarredCount(starredMails)
            })
            .catch(err => console.log('err:', err))
    }

    function onRemoveMail(mailId, ev) {
        ev.stopPropagation()
        const mail = mails.find(mail => mail.id === mailId)
        if (!mail) return

        if (mail.removedAt !== null) {
            mailService.remove(mailId)
                .then(() => {
                    showSuccessMsg('Mail Removed Permanently!')
                    setMails((prevMails) =>
                        prevMails.filter(mail => mail.id !== mailId))
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem removing mail permanently')
                })
        } else {
            const updatedMail = { ...mail, removedAt: Date.now() }
            mailService.save(updatedMail)
                .then(() => {
                    showSuccessMsg('Mail Moved to Trash!')
                    setMails((prevMails) =>
                        prevMails.map(mail =>
                            mail.id === mailId ? updatedMail : mail))
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem moving mail to trash')
                })
        }
    }

    function onSetFilter(filterBy) {
        console.log('filterBy', filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onToggleStarred(mailId) {
        const mail = mails.find(mail => mail.id === mailId)
        if (!mail) return
        const updatedMails = mails.map(mail =>
            mail.id === mailId ? { ...mail, isStared: !mail.isStared } : mail)
        setMails(updatedMails)

        const starredMails = updatedMails.filter(mail => mail.isStared).length
        setStarredCount(starredMails)

        mailService.save({ ...mail, isStared: !mail.isStared })
            .catch(err => {
                console.log('Error updating starred status:', err)
                showErrorMsg('Failed to update starred status')
                loadMails()
            })
    }

    function onToggleReadStatus(mailId, ev) {
        const mail = mails.find(mail => mail.id === mailId)
        if (!mail) return
        ev.stopPropagation()
        const updatedMails = mails.map(mail =>
            mail.id === mailId ? { ...mail, isRead: !mail.isRead } : mail)
        setMails(updatedMails)

        const redeStatusMails = updatedMails.filter(mail => !mail.isRead).length
        setUnreadCount(redeStatusMails)

        mailService.save({ ...mail, isRead: !mail.isRead })
            .catch(err => {
                console.log('Error updating read status:', err)
                showErrorMsg('Failed to update read status')
                loadMails()
            })
    }

    function onReplyClick(mailId, ev) {
        ev.stopPropagation()
        navigate(`/mail/edit/${mailId}`);
    }

    function onMailClick(mailId) {
        navigate(`/mail/${mailId}`)
    }

    function handleToggleSidebar(action) {
        if (action === 'toggle') {
            setIsSidebarExpanded(prev => !prev)
        } else if (typeof action === 'boolean') {
            setIsSidebarExpanded(action)
        }
    }

    function onSaveEmailAsNote(mailId, ev) {
        ev.stopPropagation()
        const mail = mails.find(mail => mail.id === mailId)
        console.log('mail from onSaveEmailAsNote', mail)
        if (!mail) return
        const noteData = noteService.getEmptyNote()
        const { body, subject } = mail
        noteData.info = {
            txt: body,
            title: subject
        }
        noteService.save(noteData)
            .then(() => {
                    showSuccessMsg('Mail saved as note!')
                })
    }

    if (!mails) return <div className="loader">Loading...</div>

    return (
        <Fragment>
            <MailHeader
                defaultFilter={filterBy}
                onSetFilter={onSetFilter}
                onToggleSidebar={() => handleToggleSidebar('toggle')}
            />
            <section className="mail-index">
                <MailSidebar
                    unreadCount={unreadCount}
                    starredCount={starredCount}
                    currentFilter={filterBy}
                    onSetFilter={onSetFilter}
                    isExpanded={isSidebarExpanded}
                    onToggleSidebar={handleToggleSidebar}
                />
                {/* <MailHeader
                defaultFilter={filterBy}
                onSetFilter={onSetFilter}
            />
            <section className="btn-container">
                <Link className="btn" to="/mail/edit">Add Mail</Link>
                <Link className="btn" to="/mail/add">Add Google Mail</Link>
                <Link className="btn" to="/mail/chart">Categories chart</Link>
            </section> */}

                {!isDetailsView && (
                    <MailList
                        mails={mails}
                        onRemoveMail={onRemoveMail}
                        onToggleStarred={onToggleStarred}
                        onToggleReadStatus={onToggleReadStatus}
                        onReplyClick={onReplyClick}
                        onMailClick={onMailClick}
                        onSaveEmailAsNote={onSaveEmailAsNote}
                    />
                )}

                <Outlet context={{
                    mails,
                    onRemoveMail,
                    onToggleStarred,
                    onToggleReadStatus,
                    onReplyClick,
                    onMailClick,
                    onSaveEmailAsNote
                }} />
            </section>
        </Fragment>
    )


}