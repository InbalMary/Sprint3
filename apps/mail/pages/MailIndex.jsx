
import { mailService } from '../services/mail.service.js'
// import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailHeader } from "../cmps/MailHeader.jsx"
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

        const redeStatusMails = updatedMails.filter(mail => mail.isRead).length
        setUnreadCount(redeStatusMails)
    }

    function onReplyClick(mailId, ev) {
        ev.stopPropagation()
        navigate(`/mail/edit/${mailId}`);
    }

    function onMailClick(mailId) {
        navigate(`/mail/${mailId}`)
    }

    const [isExpanded, setIsExpanded] = useState(false)

    if (!mails) return <div className="loader">Loading...</div>

    return (
        <Fragment>
            <MailHeader />
            <section className="mail-index">
                <nav className="sidebar-icon-bar"
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                    onClick={() => setIsExpanded(prev => !prev)}>

                    <ul className="sidebar-menu">
                        <li className="sidebar-item compose">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                </svg>

                            </div>
                        </li>

                        <li className="sidebar-item">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-120H640q-30 38-71.5 59T480-240q-47 0-88.5-21T320-320H200v120Zm280-120q38 0 69-22t43-58h168v-360H200v360h168q12 36 43 58t69 22ZM200-200h560-560Z" />
                                </svg>

                            </div>
                        </li>

                        <li className="sidebar-item">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                                </svg>

                                <span className="count"></span>
                            </div>
                        </li>

                        <li className="sidebar-item">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                </svg>

                            </div>
                        </li>

                        <li className="sidebar-item">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                                </svg>

                            </div>
                        </li>

                        <li className="sidebar-item">
                            <div className="sidebar-link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>

                            </div>
                        </li>
                    </ul>
                </nav>

                {isExpanded && (
                    <div className={`sidebar-expanded ${isExpanded ? 'open' : ''}`}
                        onMouseEnter={() => setIsExpanded(true)}
                        onMouseLeave={() => setIsExpanded(false)}>
                        <ul className="sidebar-menu">
                            <li className="sidebar-item compose">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                    </svg>
                                    <span><Link className="btn" to="/mail/edit">Compose</Link></span>
                                </div>
                            </li>

                            <li className="sidebar-item">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-120H640q-30 38-71.5 59T480-240q-47 0-88.5-21T320-320H200v120Zm280-120q38 0 69-22t43-58h168v-360H200v360h168q12 36 43 58t69 22ZM200-200h560-560Z" />
                                    </svg>
                                    <span>Inbox</span>
                                    <span className="count">{unreadCount}</span>
                                </div>
                            </li>

                            <li className="sidebar-item">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                                    </svg>
                                    <span>Starred</span>
                                    <span className="count">{starredCount}</span>
                                </div>
                            </li>

                            <li className="sidebar-item">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                    </svg>
                                    <span>Sent</span>
                                </div>
                            </li>

                            <li className="sidebar-item">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                                    </svg>
                                    <span>Draft</span>
                                </div>
                            </li>

                            <li className="sidebar-item">
                                <div className="sidebar-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                    </svg>
                                    <span>Trash</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
                {/* <MailFilter
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