import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'
_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getDefaultFilter,
    getFilterFromSearchParams,
    removeMailToTrash
}

//For debug:
window.mailService = mailService

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                mails = mails.filter(mail => regExp.test(mail.subject)
                    || regExp.test(mail.body) || regExp.test(mail.from)
                    || regExp.test(mail.to))
            }

            if (filterBy.isRead !== '') {
                mails = mails.filter(mail => mail.isRead === filterBy.isRead)
            }

            if (filterBy.status) {
                switch (filterBy.status) {
                    case 'inbox':
                        mails = mails.filter(mail =>
                            mail.to === loggedinUser.email &&
                            mail.removedAt === null)
                        break
                    case 'sent':
                        mails = mails.filter(mail =>
                            mail.from === loggedinUser.email &&
                            mail.removedAt === null)
                        break
                    case 'starred':
                        mails = mails.filter(mail =>
                            mail.isStared &&
                            mail.removedAt === null)
                        break
                    case 'trash':
                        mails = mails.filter(mail =>
                            mail.removedAt !== null)
                        break
                    case 'draft':
                        mails = mails.filter(mail =>
                            !mail.sentAt && mail.removedAt === null)
                        break
                    default:
                        break
                }
            }
            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId).then(_setNextPrevMailId)
}

function remove(mailId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
    }
}

function getEmptyMail(to = '', subject = '', body = '') {
    return {
        id: "",
        createdAt: "",
        subject: "",
        body: "",
        isRead: false,
        sentAt: "",
        removedAt: null,
        from: loggedinUser.email,
        to: "",
        isStared: false
    }
}

function getDefaultFilter() {
    return {
        status: 'inbox',
        txt: '',
        isRead: '',
        isStared: null,
        lables: []
    }
}

function removeMailToTrash(mailId) {
    return get(mailId).then(mail => {
        if (mail.status !== 'trash') {
            mail.status = 'trash'
            mail.removedAt = Date.now()
            return save(mail)
        } else {
            return remove(mailId).then(() => null)
        }
    })
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        const mails = [
            {
                id: 'e101',
                createdAt: 1684902120000,  // 2023-05-24
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                sentAt: 1684902180000,  // 2023-05-24
                removedAt: null,
                from: 'momo@momo.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e102',
                createdAt: 1684602720000,  // 2023-05-19
                subject: 'Meeting Reminder',
                body: 'Don’t forget our meeting tomorrow.',
                isRead: true,
                sentAt: 1684602780000,  // 2023-05-19
                removedAt: null,
                from: 'john@meeting.com',
                to: 'user@appsus.com',
                isStared: true
            },
            {
                id: 'e103',
                createdAt: 1683474930000,  // 2023-04-19
                subject: 'Discount for you!',
                body: 'Enjoy 20% off on your next purchase.',
                isRead: false,
                sentAt: 1683474990000,  // 2023-04-19
                removedAt: null,
                from: 'sale@shop.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e104',
                createdAt: 1683173930000,  // 2023-04-15
                subject: 'Your Subscription Expires Soon!',
                body: 'Renew your subscription today and enjoy extra benefits.',
                isRead: true,
                sentAt: 1683174930000,  // 2023-04-15
                removedAt: null,
                from: 'support@service.com',
                to: 'user@appsus.com',
                isStared: true
            },
            {
                id: 'e105',
                createdAt: 1682775120000,  // 2023-04-01
                subject: 'עדכון חודשי',
                body: 'הנה כל העדכונים והחדשות החמות לחודש הזה. אנחנו שמחים לשתף אותך עם כל מה שקרה בארגון שלנו, כולל שדרוגים חדשים במערכת, מוצרים חדשים שיצאו לשוק, ומבצעים בלעדיים שזמינים רק ללקוחות שלנו. אל תחמיץ את זה!',
                isRead: false,
                sentAt: 1682856120000,  // 2023-04-02
                removedAt: null,
                from: 'newsletter@updates.com',
                to: 'user@appsus.com',
                isStared: true
            },
            {
                id: 'e106',
                createdAt: 1682760000000,  // 2023-03-31
                subject: 'Urgent: Your Attention Needed',
                body: 'There’s an issue with your account. Please resolve it ASAP.',
                isRead: true,
                sentAt: 1682760600000,  // 2023-03-31
                removedAt: null,
                from: 'admin@account.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e107',
                createdAt: 1684354560000,  // 2023-05-16
                subject: 'Special Offer Just for You!',
                body: 'Get an exclusive offer only available to our best customers.',
                isRead: false,
                sentAt: 1684435560000,  // 2023-05-17
                removedAt: null,
                from: 'offers@deals.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e108',
                createdAt: 1684080570000,  // 2023-05-13
                subject: 'Confirm Your Email Address',
                body: 'Please confirm your email to finish signing up.',
                isRead: false,
                sentAt: 1684080570000,  // 2023-05-13
                removedAt: null,
                from: 'no-reply@verify.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e109',
                createdAt: 1681862160000,  // 2023-03-12
                subject: 'Job Offer - We Need You!',
                body: 'We’ve reviewed your resume and would like to offer you a position.',
                isRead: true,
                sentAt: 1681943160000,  // 2023-03-13
                removedAt: null,
                from: 'hr@company.com',
                to: 'user@appsus.com',
                isStared: false
            },
            {
                id: 'e110',
                createdAt: 1682765400000,  // 2023-04-01
                subject: 'הזמנה לוובינר',
                body: 'יש לנו וובינר מעניין שיתקיים ביום שלישי הקרוב, ואנחנו רוצים להזמין אותך אליו. במהלך הוובינר נשתף את כל המגמות החדשות בתחום, טיפים וטריקים למקסום ביצועים. אל תחמיץ את ההזדמנות ללמוד ממומחים בתחום!',
                isRead: false,
                sentAt: 1682765400000,  // 2023-04-01
                removedAt: null,
                from: 'webinars@events.com',
                to: 'user@appsus.com',
                isStared: true
            }
        ]

        utilService.saveToStorage(MAIL_KEY, mails)
    }
}

function _createMail(subject) {
    const mail = getEmptyMail(subject)
    mail.id = utilService.makeId()
    return mail
}



function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        const value = searchParams.get(field)
        filterBy[field] = (value !== null) ? value : defaultFilter[field]
    }
    return filterBy
}



function _setNextPrevMailId(mail) {
    return query().then((mails) => {
        const mailIdx = mails.findIndex((currMail) => currMail.id === mail.id)
        const nextMail = mails[mailIdx + 1] ? mails[mailIdx + 1] : mails[0]
        const prevMail = mails[mailIdx - 1] ? mails[mailIdx - 1] : mails[mails.length - 1]
        mail.nextMailId = nextMail.id
        mail.prevMailId = prevMail.id
        return mail
    })
}



