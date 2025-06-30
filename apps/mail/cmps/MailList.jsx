import { MailPreview } from "./MailPreview.jsx";

const { Link, useLocation } = ReactRouterDOM

export function MailList({ mails, onRemoveMail, onAddMail }) {

    const location = useLocation()

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
                    <MailPreview key={mail.id} mail={mail} />                    
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