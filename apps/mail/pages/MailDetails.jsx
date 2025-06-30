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

    const { vendor, speed } = mail
    return (
        <section className="mail-details container">
            <pre>{JSON.stringify(mail, null, 2)}</pre>
            {/* <h1>Mail Vendor: {vendor}</h1>
            <h1>Mail Speed: {speed}</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis quae fuga eveniet, quisquam ducimus modi optio in alias accusantium corrupti veritatis commodi tenetur voluptate deserunt nihil quibusdam. Expedita, architecto omnis?</p>
            <img src={`../assets/img/${vendor}.png`} alt="Mail Image" />
            <button onClick={onBack}>Back</button>
            <section>
                <button ><Link to={`/mail/${mail.prevMailId}`}>Prev Mail</Link></button>
                <button ><Link to={`/mail/${mail.nextMailId}`}>Next Mail</Link></button>
            </section> */}
        </section>
    )
}