import { mailService } from "../services/mail.service.js"
const { useParams, useNavigate, Link } = ReactRouterDOM

const { useState, useEffect } = React

export function MailDetails() {

    const [mail, setMail] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadMail()
    }, [params.mailId])

    function loadMail() {
        setIsLoading(true)
        mailService.get(params.mailId)
            .then(mail => setMail(mail))
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }


    function onBack() {
        navigate('/mail')
    }

    if (isLoading) return <div className="loader">Loading...</div>

    const { subject, body, isRead, sentAt, from, to } = mail

    return (
        <section className="mail-details container">
            {/* <pre>{JSON.stringify(mail, null, 2)}</pre> */}
            <header>
                <button>
                    <img src="/assets/icons/mail/arrow_back.svg" alt="back-btn" width="20" height="20"></img>
                </button>
                <button>
                    <img src="/assets/icons/mail/reply.svg" alt="back-btn" width="20" height="20"></img>
                </button>
                <button>
                    <img src="/assets/icons/mail/delete_btn.svg" alt="delete-btn" width="20" height="20"></img>
                </button>
                <button>
                    <img src="/assets/icons/mail/mark_email_unread.svg" alt="delete-btn" width="20" height="20"></img>
                </button>
            </header>
            <h1>Subject: {subject}</h1>
            <h4>From: {from}</h4>
            <h4>To: {to}</h4>
            <p>{body}</p>
            {/* <section>
                <button ><Link to={`/mail/${mail.prevMailId}`}>Prev Mail</Link></button>
                <button ><Link to={`/mail/${mail.nextMailId}`}>Next Mail</Link></button>
            </section> */}
        </section>
    )
}