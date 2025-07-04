
import { mailService } from '../services/mail.service.js'
// import { MailHeader } from "../cmps/MailHeader.jsx"
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
        const updatedMails = mails.map(mail =>
            mail.id === mailId ? { ...mail, isStared: !mail.isStared } : mail)
        setMails(updatedMails)

        const starredMails = updatedMails.filter(mail => mail.isStared).length
        setStarredCount(starredMails)
    }

    function onToggleReadStatus(mailId, ev) {
        ev.stopPropagation()
        const updatedMails = mails.map(mail =>
            mail.id === mailId ? { ...mail, isRead: !mail.isRead } : mail)
        setMails(updatedMails)

        const redeStatusMails = updatedMails.filter(mail => !mail.isRead).length
        setUnreadCount(redeStatusMails)
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
            <MailHeader />
            <section className="mail-index">
                <MailSidebar
                    unreadCount={unreadCount}
                    starredCount={starredCount}
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