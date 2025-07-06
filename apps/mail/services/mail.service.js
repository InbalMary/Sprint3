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
    removeMailToTrash,
    formatMailTimestamp
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
            },
            {
                id: 'e111',
                createdAt: 1681862160000,  // 2023-04-19
                subject: 'Your Dream Vacation Package - Mediterranean Cruise Adventure Awaits!',
                body: `Dear Alex,

Greetings from the Wanderlust Travel Agency! I hope this email finds you planning your next amazing adventure.

I'm reaching out with incredible news - we've just secured exclusive access to one of the most sought-after Mediterranean cruise experiences for this summer, and I immediately thought of you given your interest in European travel that you mentioned during our last conversation.

**🚢 EXCLUSIVE MEDITERRANEAN ODYSSEY CRUISE 🚢**

**Cruise Details:**
• **Ship**: Royal Caribbean's Symphony of the Seas (One of the world's largest cruise ships!)
• **Duration**: 12 days, 11 nights
• **Departure**: July 15th, 2023 from Barcelona, Spain
• **Return**: July 27th, 2023 to Rome, Italy
• **Cabin**: Balcony Suite with Ocean View (Deck 9)

**Your Incredible Itinerary:**
🇪🇸 **Day 1-2: Barcelona, Spain**
- Explore Gaudí's architectural masterpieces
- Stroll through the Gothic Quarter
- Experience the vibrant nightlife of Las Ramblas

🇫🇷 **Day 3-4: Nice & Cannes, France**
- Discover the glamorous French Riviera
- Optional excursion to Monaco and Monte Carlo
- Visit the famous Cannes Film Festival location

🇮🇹 **Day 5-6: Rome & Florence, Italy**
- Guided tour of the Colosseum and Vatican City
- Day trip to Florence to see Michelangelo's David
- Authentic Italian cooking class included

🇬🇷 **Day 7-8: Santorini & Mykonos, Greece**
- Witness the world-famous Santorini sunset
- Explore the charming windmills of Mykonos
- Swimming in crystal-clear Aegean waters

🇹🇷 **Day 9-10: Istanbul, Turkey**
- Visit the magnificent Hagia Sophia and Blue Mosque
- Explore the Grand Bazaar for unique souvenirs
- Traditional Turkish bath experience

🇭🇷 **Day 11: Dubrovnik, Croatia**
- Walk the ancient city walls
- Game of Thrones filming location tour
- Kayaking around the stunning coastline

**What's Included in Your Package:**
✅ All meals (5 restaurants, 24/7 room service)
✅ All guided shore excursions mentioned above
✅ Onboard entertainment (Broadway shows, live music, comedy clubs)
✅ All port taxes and fees
✅ Complimentary Wi-Fi throughout the cruise
✅ Spa credit worth $200
✅ Specialty dining package ($150 value)
✅ Unlimited beverage package (alcoholic & non-alcoholic)
✅ Gratuities for all staff
✅ Travel insurance with medical coverage

**Ship Amenities & Activities:**
🏊‍♀️ Multiple pools and waterslides
🎭 Theater with Broadway-style productions
🍽️ 15+ dining venues including specialty restaurants
🎰 Casino and gaming lounge
🧘‍♀️ World-class spa and fitness center
🛍️ Duty-free shopping promenade
🎵 Live music venues and dance clubs
🏀 Sports deck with basketball and mini golf
🧗‍♀️ Rock climbing wall and surf simulator

**Special Exclusive Offer - Limited Time Only:**
**Original Price**: $4,299 per person
**Your Exclusive Price**: $2,899 per person (Save $1,400!)
**For Couples**: Book for two and save an additional $300 (Total savings: $3,100!)

**Payment Options:**
• Full payment: Additional 3% discount
• Monthly payments: 6 months, 0% interest
• Deposit: Just $500 to secure your spot

**Why Book This Cruise:**
This isn't just a vacation - it's a once-in-a-lifetime experience that combines the luxury of a floating resort with the cultural richness of 8 different countries. You'll wake up in a new destination almost every day, with no need to pack and unpack or worry about transportation between cities.

Our previous clients have described this cruise as "absolutely life-changing" and "the best vacation we've ever taken." The ship's size means you'll never feel crowded, and there's literally something for everyone - from quiet deck spaces for reading to thrilling entertainment and adventures in every port.

**What Our Clients Say:**
"This cruise exceeded every expectation. The food was incredible, the staff was amazing, and seeing 8 countries in 12 days was a dream come true!" - Jennifer & Mark, Previous Guests

**Limited Availability:**
I need to be honest with you - we only have 6 cabins left at this exclusive rate, and they're selling fast. Three were booked just yesterday! Given the incredible value and the peak summer timing, I expect these last few cabins to be gone within the next 72 hours.

**Next Steps:**
I'd love to hop on a quick 15-minute call to answer any questions you might have and walk you through the booking process. I'm available tomorrow (Wednesday) between 10 AM - 4 PM, or Thursday morning.

Alternatively, if you're ready to secure your spot, I can send you the booking link right now - it takes just 5 minutes to complete, and you'll receive instant confirmation.

**Contact Information:**
📧 Email: jessica.martinez@wanderlusttravel.com
📞 Direct Phone: +1-555-CRUISE-1 (555-278-4731)
📱 WhatsApp: +1-555-278-4731
🌐 Website: www.wanderlusttravel.com/mediterranean-cruise

I'm also attaching some stunning photos from previous cruises and a detailed deck plan so you can see exactly what awaits you!

Don't let this incredible opportunity sail away - literally! I've seen too many clients regret waiting on deals like this.

Looking forward to helping you create memories that will last a lifetime!

Warm regards,

Jessica Martinez
Senior Travel Consultant & Mediterranean Cruise Specialist
Wanderlust Travel Agency
"Making Your Travel Dreams Come True Since 2010"

P.S. If you book by Friday, I'll throw in a complimentary wine tasting excursion in Santorini (valued at $120 per person) as my personal thank you gift!

---
This email contains promotional offers valid until the dates specified. Terms and conditions apply. Please contact us for full details.`,
                isRead: false,
                sentAt: 1681943160000,  // 2023-04-19
                removedAt: null,
                from: 'jessica.martinez@wanderlusttravel.com',
                to: 'user@appsus.com',
                isStared: false,
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

function formatMailTimestamp(timestamp) {
    const now = new Date()
    const sentDate = new Date(timestamp)

    const diffMs = now - sentDate
    const diffMinutes = Math.floor(diffMs / 1000 / 60)
    const diffHours = Math.floor(diffMinutes / 60)

    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
    const timeString = sentDate.toLocaleTimeString('en-US', timeOptions)

    if (diffHours < 24) {
        if (diffHours >= 1) {
            return `${timeString} (${diffHours} hour${diffHours > 1 ? 's' : ''} ago)`
        } else {
            return `${timeString} (${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago)`
        }
    } else {
        const dateOptions = { month: 'short', day: 'numeric' }
        return sentDate.toLocaleDateString('en-US', dateOptions)
    }
}

