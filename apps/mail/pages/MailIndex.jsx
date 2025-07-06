
import { mailService } from '../services/mail.service.js'
import { MailList } from "../cmps/MailList.jsx"
import { MailHeader } from "../cmps/MailHeader.jsx"
import { MailSidebar } from "../cmps/MailSidebar.jsx"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"

const { Outlet, Link, useSearchParams, useNavigate, useLocation } = ReactRouterDOM
const { useState, useEffect, Fragment } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const [unreadCount, setUnreadCount] = useState(0)
    const [starredCount, setStarredCount] = useState(0)
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
        mailService.remove(mailId)
            .then(() => {
                showSuccessMsg('Mail Removed Successfully!')
                setMails((prevMails) =>
                    prevMails.filter(mail => mail.id !== mailId)
                )
                // navigate('/mail')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg('Problem removing mail')
            })
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

    if (!mails) return <div className="loader">Loading...</div>

    return (
        <Fragment>
            <MailHeader
                defaultFilter={filterBy}
                onSetFilter={onSetFilter} />
            <section className="mail-index">
                <MailSidebar
                    unreadCount={unreadCount}
                    starredCount={starredCount}
                    currentFilter={filterBy}
                    onSetFilter={onSetFilter}
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
                    />
                )}

                <Outlet context={{
                    mails,
                    onRemoveMail,
                    onToggleStarred,
                    onToggleReadStatus,
                    onReplyClick,
                    onMailClick
                }} />
            </section>
        </Fragment>
    )


}