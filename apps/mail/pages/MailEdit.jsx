import { mailService } from '../services/mail.service.js'
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef, Fragment } = React
const { useNavigate, useParams } = ReactRouterDOM

export function MailEdit() {
    const [mail, setMail] = useState(mailService.getEmptyMail())
    const [idAutoSaveInterval, setIdAutoSaveInterval] = useState(null)
    const [isMinimized, setIsMinimized] = useState(false)
    const navigate = useNavigate()
    const { mailId } = useParams()
    const mailRef = useRef(mail)

    useEffect(() => {
        mailRef.current = mail
    }, [mail])

    useEffect(() => {
        if (mailId) loadMail()

        const interval = setInterval(() => {
            const currentMail = mailRef.current
            if (!currentMail.id) {
                const newMail = { ...currentMail, createdAt: Date.now() }
                mailService.save(newMail)
                    .then(savedMail => {
                        setMail(savedMail)
                        // showSuccessMsg('Mail auto-saved')
                    })
            } else {
                const updatedMail = { ...currentMail, updatedAt: Date.now() }
                mailService.save(updatedMail)
                // .then(()=> showSuccessMsg('Mail auto-saved'))
            }
        }, 5000)
        setIdAutoSaveInterval(interval)
        return () => clearInterval(interval)
    }, [mailId])


    function loadMail() {
        if (mailId) {
            mailService.get(mailId)
                .then(mail => {
                    setMail(mail)
                })
                .catch(err => {
                    console.log('err:', err)
                })
        } else {
            const newMail = mailService.getEmptyMail()
            setMail(newMail)
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setMail(prevMail => ({ ...prevMail, [field]: value }))
    }

    function onClose() {
        clearInterval(idAutoSaveInterval)
        navigate('/mail')
    }

    function onMinimize() {
        setIsMinimized(prev => !prev)
    }

    function onSendMail() {
        clearInterval(idAutoSaveInterval)
        const updatedMail = { ...mailRef.current, sentAt: Date.now() }
        if (!updatedMail.createdAt) {
            updatedMail.createdAt = Date.now()
        }
        // console.log(updatedMail)
        mailService.save(updatedMail).then(() => {
            showSuccessMsg('Message sent')
            navigate('/mail')
        })
    }

    function onDeleteMail() {
        clearInterval(idAutoSaveInterval)
        const mailId = mailRef.current.id
        if (!mailId) showErrorMsg('Mail ID is missing, cannot remove mail.')
        const currentMail = mailRef.current
        if (currentMail.removedAt !== null) {
            mailService.remove(mailId)
                .then(() => {
                    showSuccessMsg('Conversation deleted forever.')
                    navigate('/mail')
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem removing mail permanently')
                })
        } else {
            const updatedMail = { ...currentMail, removedAt: Date.now() }
            mailService.save(updatedMail)
                .then(() => {
                    showSuccessMsg('Conversation moved to Trash.')
                    navigate('/mail')
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Problem moving mail to trash')
                })
        }
    }

    if (!mail) return <div className="loader">Loading...</div>

    const { subject, body, isRead, sentAt, from, to } = mail
    const isEditMode = mailId !== undefined

    return (
        <section className={`mail-edit ${isEditMode ? 'expanded' : ''} ${isMinimized ? 'minimized' : ''}`}>

            <form onSubmit={(ev) => {
                ev.preventDefault()
                onSendMail()
            }}>
                <section className="header">
                    <h4>{mailId ? 'Reply ' : 'New '}Message</h4>
                    <div className="header-actions">
                        <button type="button" onClick={onMinimize} className="minimize-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-120v-80h480v80H240Z" /></svg></button>
                        <button type="button" onClick={onClose} className="close-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></button>
                    </div>
                </section>

                {!isMinimized && (
                    <Fragment >
                        <section className='form-row'>
                            <label htmlFor="to">To</label>
                            <input
                                onChange={handleChange}
                                value={mailId ? from : to}
                                name="to"
                                id="to"
                                type="email"
                            />
                        </section>

                        <section className='form-row'>
                            {/* <label htmlFor="subject"></label> */}
                            <input
                                onChange={handleChange}
                                value={subject}
                                name="subject"
                                id="subject"
                                type="text"
                                placeholder='Subject'
                            />
                        </section>

                        <section className='form-row textarea-row'>
                            <label htmlFor="body"></label>
                            <textarea
                                onChange={handleChange}
                                value={body}
                                name="body"
                                id="body"
                                type="body"
                            />
                        </section>

                        <div className="actions">
                            <button type="submit" className="send-btn">Send</button>
                            <button type="button" onClick={onDeleteMail} className="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button>
                        </div>
                    </Fragment>)}
            </form>
        </section>
    )
}