
import {mailService} from '../services/mail.service.js'
// import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { utilService } from "../../../services/util.service.js"

const { Link, useSearchParams } = ReactRouterDOM
const { useState, useEffect } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))

    useEffect(() => {
        loadMails()
        setSearchParams(utilService.getTruthyValues(filterBy))
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => console.log('err:', err))
    }

    function onRemoveMail(mailId) {
        mailService.remove(mailId)
            .then(() => {
                showSuccessMsg('Mail Removed Successfully!')
                setMails((prevMails) =>
                    prevMails.filter(mail => mail.id !== mailId)
                )
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

    if (!mails) return <div className="loader">Loading...</div>

    return (
        <section className="mail-index container">
            {/* <MailFilter
                defaultFilter={filterBy}
                onSetFilter={onSetFilter}
            />
            <section className="btn-container">
                <Link className="btn" to="/mail/edit">Add Mail</Link>
                <Link className="btn" to="/mail/add">Add Google Mail</Link>
                <Link className="btn" to="/mail/chart">Categories chart</Link>
            </section> */}

            <MailList
                mails={mails}
                onRemoveMail={onRemoveMail}
            />
        </section>
    )


}