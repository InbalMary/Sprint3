
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

    useEffect(() => {
        loadCounts()
    }, [])

    function loadMails() {
        mailService.query(filterBy)
            .then((mails) => {
                setMails(mails)
            })
            .catch(err => console.log('err:', err))
    }

    function loadCounts() {
        mailService.query()
            .then((allMails) => {
                // console.log('All mails in loadCounts:', allMails)
                const unreadMails = allMails.filter(mail => !mail.isRead).length
                setUnreadCount(unreadMails)
                const starredMails = allMails.filter(mail => mail.isStared).length
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
                    showSuccessMsg('Conversation deleted forever.')
                    setMails((prevMails) =>
                        prevMails.filter(mail => mail.id !== mailId))
                    loadCounts()
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem removing mail permanently')
                })
        } else {
            const updatedMail = { ...mail, removedAt: Date.now() }
            mailService.save(updatedMail)
                .then(() => {
                    showSuccessMsg('Conversation moved to Trash.')
                    setMails((prevMails) =>
                        prevMails.map(mail =>
                            mail.id === mailId ? updatedMail : mail))
                    loadCounts()
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem moving mail to trash')
                })
        }
    }

    function onSetFilter(filterBy) {
        // console.log('filterBy', filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onToggleStarred(mailId) {
        const mail = mails.find(mail => mail.id === mailId)
        if (!mail) return
        const updatedMails = mails.map(mail =>
            mail.id === mailId ? { ...mail, isStared: !mail.isStared } : mail)
        setMails(updatedMails)

        mailService.save({ ...mail, isStared: !mail.isStared })
            .then(() => {
                loadCounts()
            })
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

        mailService.save({ ...mail, isRead: !mail.isRead })
            .then(() => {
                loadCounts()
            })
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

    function onSaveMailAsNote(mailId, ev) {
        ev.stopPropagation()
        const mail = mails.find(mail => mail.id === mailId)
        console.log('mail from onSaveMailAsNote', mail)
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

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if (value === 'true') value = true
        else if (value === 'false') value = false

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setFilterBy(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    function toggleSort(sortBy) {
        let newSortDirection = 'asc';
        if (filterBy.sortBy === sortBy) {
            newSortDirection = filterBy.sortDirection === 'asc' ? 'desc' : 'asc';
        }
        setFilterBy(prev => ({ ...prev, sortBy, sortDirection: newSortDirection }))
    }

    function clearAllFilters() {
        const status = searchParams.get('status') || ''
        setFilterBy({
            txt: '',
            isRead: '',
            from: '',
            subject: '',
            sortBy: null,
            sortDirection: 'asc',
            status
        })
    }

    function onUpdateMailLabels(mailId, labelName, action) {
        mailService.updateLabels(mailId, labelName, action)
            .then(updatedMail => {
                setMails(prevMails => prevMails.map(mail =>
                    mail.id === mailId ? updatedMail : mail))
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
            <section className={`mail-index ${isSidebarExpanded ? 'sidebar-open' : ''}`}>
                <MailSidebar
                    unreadCount={unreadCount}
                    starredCount={starredCount}
                    currentFilter={filterBy}
                    onSetFilter={onSetFilter}
                    isExpanded={isSidebarExpanded}
                    onToggleSidebar={handleToggleSidebar}
                />

                {!isDetailsView && (
                    <MailList
                        mails={mails}
                        onRemoveMail={onRemoveMail}
                        onToggleStarred={onToggleStarred}
                        onToggleReadStatus={onToggleReadStatus}
                        onReplyClick={onReplyClick}
                        onMailClick={onMailClick}
                        onSaveMailAsNote={onSaveMailAsNote}
                        filterByToEdit={filterBy}
                        handleChange={handleChange}
                        toggleSort={toggleSort}
                        clearAllFilters={clearAllFilters}
                        onUpdateMailLabels={onUpdateMailLabels}
                    />
                )}

                <Outlet context={{
                    mails,
                    onRemoveMail,
                    onToggleStarred,
                    onToggleReadStatus,
                    onReplyClick,
                    onMailClick,
                    onSaveMailAsNote,
                    onUpdateMailLabels
                }} />
            </section>
        </Fragment>
    )


}