import { MailPreview } from "./MailPreview.jsx";

const { Link, useNavigate, useLocation } = ReactRouterDOM

export function MailList({ mails, onRemoveMail, onAddMail }) {

    const navigate = useNavigate()
    // const location = useLocation()

    function onPreviewClick(mailId) {
        console.log('mailId', mailId)
        navigate(`/mail/${mailId}`)
    }

    return (
        <table className="mail-list container">
            <thead>
                <tr>
                    <th></th>
                    <th>From</th>
                    <th>Topic</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {mails.map(mail =>
                    <MailPreview key={mail.id} mail={mail}
                        onClick={() => onPreviewClick(mail.id)} />
                    /* {!location.pathname.includes('add') ?
                        <section className="btns">
                            <button onClick={() => onRemoveMail(mail.id)}>
                                Remove
                            </button>
                            <Link to={`/mail/${mail.id}`}>
                                <button>Details</button>
                            </Link>
                            <Link to={`/mail/edit/${mail.id}`}>
                                <button>Edit</button>
                            </Link>
                        </section> :
                        <section>
                            <button onClick={() => onAddMail(mail.id)}>Add mail</button>
                        </section>
                    } */
                )}
            </tbody>
        </table>
    )

}