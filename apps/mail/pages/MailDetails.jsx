import { mailService } from '../services/mail.service.js'
import { LabelPicker } from '../../../cmps/LabelPicker.jsx'

const { useOutletContext, useParams, useNavigate, Link } = ReactRouterDOM

export function MailDetails() {
    const { mailId } = useParams()
    const navigate = useNavigate()

    const { mails, onToggleStarred, onRemoveMail, onToggleReadStatus, onReplyClick, onSaveMailAsNote, onUpdateMailLabels } = useOutletContext()

    const mail = mails && mails.find(m => m.id === mailId)
    if (!mail) return <div>Mail not found</div>

    function onBack() {
        navigate('/mail')
    }

    const { subject, body, isStared, isRead, sentAt, from, to } = mail

    return (
        <section className="mail-details">
            {/* <pre>{JSON.stringify(mail, null, 2)}</pre> */}
            <header>
                <button onClick={onBack} title="back">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
                </button>
                <button onClick={(ev) => onSaveMailAsNote(mail.id, ev)} title='Save as note'><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z" /></svg></button>
                <button onClick={(ev) => onToggleReadStatus(mailId, ev)} title={isRead ? 'Mark as unread' : 'Mark as read'}>
                    {isRead ? <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h404q-4 20-4 40t4 40H160l320 200 146-91q14 13 30.5 22.5T691-572L480-440 160-640v400h640v-324q23-5 43-14t37-22v360q0 33-23.5 56.5T800-160H160Zm0-560v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="m480-920 362 216q18 11 28 30t10 40v434q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200v-434q0-21 10-40t28-30l362-216Zm0 466 312-186-312-186-312 186 312 186Zm0 94L160-552v352h640v-352L480-360Zm0 160h320-640 320Z" /></svg>}
                </button>
                <button onClick={(ev) => onRemoveMail(mailId, ev)} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                </button>
            </header>
            <h2>Subject: {subject}</h2>
            <div className="circle-envelop">
                <div className="name-circle">{from.charAt(0)}</div>
                <div className="sender-details">
                    <div className="sender-info">
                        <div className="left-side">
                            <span className="from-name">{from.split('@')[0]}</span>
                            <span className="from-address">{` <${from}>`}</span>
                        </div>
                        <div className="right-actions">
                            <span className="timestamp">{mailService.formatMailTimestamp(sentAt)}</span>
                            <button onClick={(ev) => onReplyClick(mailId, ev)} title="Reply">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" /></svg>
                            </button>
                            <button className='star-button' onClick={(ev) => onToggleStarred(mailId, ev)} title={isStared ? 'Starred' : 'Not starred'}>
                                {isStared ? '★' : '☆'}
                            </button>
                            <LabelPicker
                                selectedLabels={mail.labels}
                                onUpdateLabels={(labelName, action) => onUpdateMailLabels(mail.id, labelName, action)}
                            />
                        </div>
                    </div>
                    <div className="to"> to {to.split('@')[0]}</div>
                </div>
            </div>

            <p className="mail-body">{body}</p>
        </section>
    )
}