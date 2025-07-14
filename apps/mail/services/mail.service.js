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
    formatMailTimestamp,
    updateLabels
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
            if (!filterBy || Object.keys(filterBy).length === 0) return mails
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
                            mail.removedAt === null &&
                            mail.sentAt !== null &&
                            mail.sentAt !== '')
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
                            (!mail.sentAt || mail.sentAt === null || mail.sentAt === '') && mail.removedAt === null)
                        break
                    default:
                        break
                }
            }
            if (filterBy.sortBy) {
                const dir = filterBy.sortDirection === 'asc' ? 1 : -1

                mails = mails.toSorted((m1, m2) => {
                    let val1 = m1[filterBy.sortBy]
                    let val2 = m2[filterBy.sortBy]

                    if (filterBy.sortBy === 'sentAt') {
                        val1 = new Date(val1).getTime()
                        val2 = new Date(val2).getTime()
                        return (val1 - val2) * dir
                    }

                    if (typeof val1 === 'string' && typeof val2 === 'string') {
                        return val1.localeCompare(val2) * dir
                    }

                    return (val1 - val2) * dir
                })
            }
            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
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
        isRead: true,
        sentAt: "",
        removedAt: null,
        from: loggedinUser.email,
        to: "",
        isStared: false,
        labels: []
    }
}

function getDefaultFilter() {
    return {
        status: 'inbox',
        txt: '',
        isRead: '',
        isStared: null,
        labels: [],
        sortBy: 'sentAt',
        sortDirection: 'desc'
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

function updateLabels(mailId, labelName, action) {
    return get(mailId)
        .then(mail => {
            let labels = mail.labels || []
            if (action === 'add' && !labels.includes(labelName)) {
                labels.push(labelName)
            } else if (action === 'remove') {
                labels = labels.filter(lable => lable !== labelName)
            }
            mail.labels = labels
            return save(mail)
        })
}


function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        const mails = [
            {
                "id": "e101",
                "createdAt": 1719766492000,
                "subject": "Miss You - Let's Catch Up Over Coffee Soon!",
                "body": "Hey Alex!\n\nI hope this message finds you well and thriving in all your endeavors! \n\nIt's been way too long since we last connected, and I've been thinking about our amazing conversations and the great times we've shared. Life has been keeping me busy with work projects and family commitments, but I realized I haven't made enough time for the people who matter most to me.\n\n**What I've been up to:**\n• Just finished a major project at work - finally launched that app we discussed!\n• Started taking pottery classes (who knew I had hidden artistic talents?)\n• Been exploring new hiking trails around the city\n• Reading some fantastic books I think you'd love\n\n**I'd love to hear about:**\n• How your new job is going - are you still loving the creative freedom?\n• Any new hobbies or interests you've picked up\n• Your thoughts on that documentary series we both wanted to watch\n• Plans for the upcoming season\n\nHow about we meet up for coffee at our favorite spot downtown? I'm free most evenings next week, and weekends work great too. We could also do a video call if that's more convenient - I just miss our chats!\n\nLet me know what works for your schedule. Can't wait to catch up properly!\n\nMissing our friendship,\nMomo\n\nP.S. I still have that book you recommended - finally ready to dive in!",
                "isRead": false,
                "sentAt": 1719766587000,
                "removedAt": null,
                "from": "momo@momo.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e102",
                "createdAt": 1745889387000,
                "subject": "Important: Project Alpha Meeting Tomorrow - Action Items Inside",
                "body": "Hi Team,\n\nI hope everyone is having a productive week! \n\nThis is a friendly reminder about our critical Project Alpha meeting scheduled for tomorrow at 2:00 PM in Conference Room B (also available via Zoom for remote participants).\n\n**Meeting Agenda:**\n• **Project Status Review** (30 minutes)\n  - Current milestone achievements\n  - Budget allocation and spending review\n  - Timeline adjustments needed\n\n• **New Feature Presentations** (45 minutes)\n  - Sarah's UI/UX improvements\n  - Mike's backend optimization results\n  - Lisa's user feedback analysis\n\n• **Next Quarter Planning** (30 minutes)\n  - Resource allocation\n  - Priority setting for Q4\n  - Risk assessment and mitigation\n\n**Please Prepare:**\n📋 **Required Reports:**\n• Weekly progress summary from your department\n• Budget variance analysis (if applicable)\n• Resource requirement forecasts\n• Any blockers or challenges you're facing\n\n📊 **Materials Needed:**\n• Laptop for presentations\n• Updated project timelines\n• Client feedback summaries\n• Performance metrics from last sprint\n\n**Important Notes:**\n• Coffee and pastries will be provided\n• Meeting will be recorded for those who can't attend\n• Please review the shared project documents beforehand\n• Come prepared with 2-3 strategic questions\n\nLooking forward to our productive discussion and planning session!\n\nBest regards,\nJohn Mitchell\nProject Manager\nPhone: +1 555-987-6543\nEmail: john@meeting.com",
                "isRead": true,
                "sentAt": 1745889494000,
                "removedAt": null,
                "from": "john@meeting.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e103",
                "createdAt": 1683474930000,
                "subject": "🎉 Exclusive 20% Off Everything - Limited Time Flash Sale!",
                "body": "Hello Valued Customer!\n\nWe're thrilled to offer you an exclusive flash sale that's available for just 48 hours!\n\nAs one of our most loyal customers, you're getting early access to our biggest discount event of the season. This is your chance to grab those items you've been eyeing at unbeatable prices.\n\n**🛍️ FLASH SALE HIGHLIGHTS:**\n\n**Your Exclusive Benefits:**\n• **20% OFF** everything in our store\n• **FREE shipping** on orders over $50\n• **Extended return policy** - 60 days instead of 30\n• **Priority customer service** - dedicated support line\n\n**🔥 TRENDING CATEGORIES:**\n\n**Electronics & Gadgets:**\n• Latest smartphones and accessories\n• Smart home devices\n• Wireless headphones and speakers\n• Gaming accessories\n\n**Fashion & Lifestyle:**\n• Seasonal clothing collections\n• Designer handbags and accessories\n• Jewelry and watches\n• Home decor and furniture\n\n**Health & Wellness:**\n• Fitness equipment and gear\n• Organic supplements\n• Skincare and beauty products\n• Yoga and meditation accessories\n\n**How to Redeem:**\n1. Browse our entire catalog at www.shop.com\n2. Add your favorite items to cart\n3. Use code 'DISCOUNT20' at checkout\n4. Enjoy your savings!\n\n**⏰ HURRY - Sale Ends in 48 Hours!**\n\nThis offer expires on [Date] at midnight. Don't miss out on this incredible opportunity to save big on premium products!\n\nHappy Shopping!\n\nThe Sales Team\nOnline Store\nCustomer Service: +1 555-SHOP-NOW\nEmail: sale@shop.com",
                "isRead": false,
                "sentAt": 1683474990000,
                "removedAt": null,
                "from": "sale@shop.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e104",
                "createdAt": 1683173930000,
                "subject": "Action Required: Renew Your Premium Subscription - Special Offer Inside!",
                "body": "Dear Valued Subscriber,\n\nWe hope you've been enjoying all the premium features and exclusive content that comes with your subscription to our service!\n\nWe're reaching out because your subscription is set to expire in just 7 days, and we want to ensure you don't miss out on any of the amazing benefits you've come to rely on.\n\n**🌟 YOUR CURRENT BENEFITS:**\n\n**Premium Access Includes:**\n• **Unlimited content streaming** - HD quality, no ads\n• **Exclusive member-only articles** and research reports\n• **Advanced analytics tools** with detailed insights\n• **Priority customer support** - 24/7 dedicated help\n• **Early access** to new features and products\n• **Monthly expert webinars** with industry leaders\n\n**🎁 SPECIAL RENEWAL OFFER:**\n\n**Renew Now and Get:**\n• **2 months FREE** when you renew for a full year\n• **25% discount** on your next billing cycle\n• **Exclusive bonus content** - premium courses worth $200\n• **VIP status** - access to beta features\n• **Personal account manager** for enterprise users\n\n**🚀 NEW FEATURES COMING SOON:**\n• AI-powered content recommendations\n• Mobile app with offline viewing\n• Enhanced collaboration tools\n• Advanced reporting dashboard\n• Integration with popular productivity apps\n\n**Renewal Options:**\n• **Monthly Plan**: $29.99/month\n• **Annual Plan**: $299.99/year (Save 17%)\n• **Two-Year Plan**: $549.99 (Save 23% + 2 months free)\n\n**Don't Let Your Access Expire!**\nRenew today to continue enjoying uninterrupted access to all premium features. Your account will automatically downgrade to our basic free plan if not renewed.\n\n**Renew Now:** [Click here to renew]\n\nQuestions? Our support team is here to help!\n\nBest regards,\nThe Support Team\nPremium Services\nPhone: +1 555-SUPPORT\nEmail: support@service.com",
                "isRead": true,
                "sentAt": 1683174930000,
                "removedAt": null,
                "from": "support@service.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e105",
                "createdAt": 1709115600000,
                "subject": "📧 עדכון חודשי מרתק - חדשות, מוצרים חדשים ומבצעים בלעדיים!",
                "body": "שלום יקר!\n\nמה השלום? אנחנו מקווים שהחודש מתחיל עבורך בצורה מעולה!\n\nהגיע הזמן לעדכון החודשי שלנו, והפעם יש לנו הרבה חדשות מרגשות לשתף איתך.\n\n**🎯 החדשות הגדולות של החודש:**\n\n**עדכונים טכנולוגיים:**\n• **מערכת חדשה לניהול לקוחות** - ממשק משתמש מחודש לחלוטין\n• **אפליקציה ניידת מעודכנת** - מהירות כפולה וממשק נקי יותר\n• **בינה מלאכותית משוכללת** - המלצות אישיות מתקדמות\n• **אבטחת סייבר מחוזקת** - הגנה ברמה צבאית על הנתונים שלך\n\n**🚀 מוצרים חדשים שיצאו לשוק:**\n\n**סדרת המוצרים הפרמיום:**\n• **חבילת העסק המתקדמת** - כלים מקצועיים לעסקים קטנים\n• **תוכנית ההכשרה המקצועית** - קורסים מעשיים עם מומחים\n• **שירות הייעוץ האישי** - ליווי אישי עם מומחים בתחום\n• **פלטפורמת השיתוף החברתי** - רשת מקצועית בלעדית\n\n**💰 מבצעים בלעדיים ללקוחות נבחרים:**\n\n**הצעות מיוחדות החודש:**\n• **הנחה של 40%** על כל המוצרים החדשים\n• **חודש ניסיון חינם** לשירות הפרמיום\n• **הדרכה אישית בחינם** עם רכישת חבילה שנתית\n• **עדכונים לכל החיים** - ללא עלות נוספת\n\n**📈 הישגים וסטטיסטיקות:**\n• **מעל 10,000 לקוחות חדשים** החודש\n• **דירוג 4.9 מתוך 5** בסקרי שביעות רצון\n• **זמן מענה ממוצע** - פחות מ-2 שעות\n• **שיעור פתרון בקריאה ראשונה** - 95%\n\n**🎉 אירועים קרובים:**\n• **וובינר מיוחד** - \"מגמות טכנולוגיות לעתיד\"\n• **יום פתוח** במשרדים החדשים שלנו\n• **כנס לקוחות שנתי** - הרשמה נפתחת בקרוב\n• **סדנאות מעשיות** במגוון נושאים\n\n**💡 טיפים חמים לחודש:**\n• הגדר התראות אישיות לעדכונים חשובים\n• נצל את הכלים החדשים לניתוח נתונים\n• הצטרף לקבוצות הדיון שלנו ברשתות החברתיות\n• עקב אחר הבלוג שלנו לתכנים מעניינים\n\nאל תחמיץ את כל ההזדמנות הזו לקבל את המקסימום מהשירותים שלנו!\n\nתודה שאתה חלק מהמשפחה שלנו!\n\nבברכה,\nצוות העדכונים\nNewsletter Updates\nטלפון: 03-1234567\nאימייל: newsletter@updates.com",
                "isRead": false,
                "sentAt": 1709202000000,
                "removedAt": null,
                "from": "newsletter@updates.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e106",
                "createdAt": 1682760000000,
                "subject": "🚨 URGENT: Security Alert - Immediate Action Required for Account Protection",
                "body": "Dear Account Holder,\n\nWe are writing to inform you of an important security matter that requires your immediate attention.\n\nOur advanced security systems have detected unusual activity on your account that requires verification to ensure your account remains secure and protected.\n\n**🔐 SECURITY ALERT DETAILS:**\n\n**What We Detected:**\n• **Unusual login attempts** from new devices/locations\n• **Changes to account settings** that weren't initiated by you\n• **Suspicious access patterns** during off-hours\n• **Failed authentication attempts** using your credentials\n\n**Immediate Actions Required:**\n\n**Step 1: Verify Your Identity**\n• Log into your account immediately\n• Confirm your current contact information\n• Review recent account activity\n• Update your password if necessary\n\n**Step 2: Security Checklist**\n• Enable two-factor authentication (2FA)\n• Review and update security questions\n• Check all connected devices and applications\n• Verify all recent transactions or changes\n\n**Step 3: Account Review**\n• Examine your account settings thoroughly\n• Remove any unrecognized devices\n• Update your recovery information\n• Set up additional security alerts\n\n**⚠️ IMPORTANT TIMELINE:**\n• **24 hours**: Complete initial verification\n• **48 hours**: Update all security settings\n• **72 hours**: Full account review completion\n\n**What Happens If No Action Is Taken:**\n• Account access may be temporarily restricted\n• Additional verification steps may be required\n• Some features may be disabled for security\n• Enhanced monitoring will be activated\n\n**How to Resolve This:**\n1. Click the secure link below to access your account\n2. Follow the step-by-step security verification process\n3. Contact our security team if you need assistance\n4. Monitor your account closely for the next few days\n\n**Need Help?**\nOur security specialists are available 24/7 to assist you with this process.\n\n**Secure Login:** [Protected Link]\n**Security Hotline:** +1 555-SECURE-1\n**Priority Support:** security@account.com\n\nThank you for your immediate attention to this matter.\n\nBest regards,\nAccount Security Team\nAdmin Services\nEmail: admin@account.com",
                "isRead": true,
                "sentAt": 1682760600000,
                "removedAt": null,
                "from": "admin@account.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e107",
                "createdAt": 1711366800000,
                "subject": "🌟 VIP Customer Special: Exclusive 60% Off Premium Products - Limited Time!",
                "body": "Dear VIP Customer,\n\nCongratulations! You've been selected as one of our most valued customers for an exclusive, limited-time offer that's not available to the general public.\n\nBased on your purchase history and loyalty, we're excited to present you with our biggest discount of the year - exclusively for you!\n\n**💎 YOUR VIP STATUS BENEFITS:**\n\n**Why You're Special:**\n• **Top 5% customer** based on purchase volume\n• **Loyalty member** for over 2 years\n• **Highest satisfaction ratings** in our surveys\n• **Active community participant** in our forums\n• **Early adopter** of new products and features\n\n**🎁 EXCLUSIVE VIP OFFER:**\n\n**Premium Product Collection:**\n• **Professional Series Laptops** - Now 60% off\n• **Designer Accessories Line** - Starting at $99\n• **Smart Home Automation Kits** - Complete systems\n• **Wireless Audio Equipment** - Studio quality\n• **Fitness & Wellness Products** - Premium brands\n\n**Additional VIP Perks:**\n• **Free premium shipping** on all orders\n• **Extended warranty** - 3 years instead of 1\n• **Personal shopping assistant** available\n• **Early access** to new product launches\n• **VIP customer support** - dedicated hotline\n\n**🔥 FLASH SALE HIGHLIGHTS:**\n\n**Limited Inventory Items:**\n• **MacBook Pro 16\"** - Was $2,499, Now $999\n• **Sony WH-1000XM4 Headphones** - Was $349, Now $139\n• **iPad Pro 12.9\"** - Was $1,099, Now $449\n• **Smart Watch Collection** - Up to 70% off\n• **Gaming Setup Bundle** - Complete package $599\n\n**⏰ URGENT: Only 48 Hours Left!**\n\nThis exclusive offer expires on [Date] at 11:59 PM. Due to limited inventory, some items may sell out before the deadline.\n\n**VIP Access Code:** VIPEXCLUSIVE60\n\n**How to Shop:**\n1. Visit our VIP section at www.deals.com/vip\n2. Browse exclusive products not available elsewhere\n3. Use your VIP code at checkout\n4. Enjoy free priority shipping\n\n**Questions?** \nContact your dedicated VIP support team at +1 555-VIP-HELP\n\nDon't miss this incredible opportunity!\n\nYour VIP Account Manager,\nSarah Johnson\nVIP Customer Relations\nOffers & Deals\nEmail: offers@deals.com",
                "isRead": false,
                "sentAt": 1711370400000,
                "removedAt": null,
                "from": "offers@deals.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e108",
                "createdAt": 1720347600000,
                "subject": "Welcome! Please Verify Your Email to Complete Registration",
                "body": "Hello and Welcome!\n\nThank you for signing up with us! We're excited to have you join our community of users who are passionate about [service/product category].\n\nTo complete your registration and start enjoying all the benefits of your new account, we need you to verify your email address.\n\n**🎉 WELCOME TO OUR COMMUNITY:**\n\n**What You'll Get Access To:**\n• **Personalized dashboard** with tailored content\n• **Exclusive member resources** and downloads\n• **Community forums** to connect with other users\n• **Regular updates** on new features and products\n• **Special member-only offers** and discounts\n• **Priority customer support** for all your needs\n\n**📧 EMAIL VERIFICATION REQUIRED:**\n\n**Why We Need Verification:**\n• **Account security** - Protect your personal information\n• **Important updates** - Ensure you receive critical notifications\n• **Password recovery** - Secure way to reset your password\n• **Exclusive content** - Access to member-only materials\n\n**How to Verify:**\n1. Click the \"Verify Email\" button below\n2. You'll be redirected to our secure confirmation page\n3. Your account will be activated automatically\n4. Start exploring all the features immediately\n\n**🔐 SECURITY INFORMATION:**\n\n**Your Account Details:**\n• **Email:** user@appsus.com\n• **Registration Date:** [Current Date]\n• **Account Type:** Free Member\n• **Verification Status:** Pending\n\n**Important Notes:**\n• This verification link expires in 24 hours\n• If you didn't create this account, please ignore this email\n• Your information is protected with enterprise-grade security\n• We never share your email with third parties\n\n**⏰ VERIFICATION LINK:**\n\n[VERIFY YOUR EMAIL ADDRESS]\n\n**Need Help?**\nIf you're having trouble with verification or have questions about your account, our support team is ready to help!\n\n**Support Options:**\n• **Email:** support@verify.com\n• **Help Center:** www.verify.com/help\n• **Live Chat:** Available 24/7 on our website\n• **Phone:** +1 555-VERIFY-1\n\n**What's Next?**\nOnce verified, you'll receive a welcome email with tips on getting started and making the most of your account.\n\nWelcome aboard!\n\nThe Verification Team\nAccount Services\nEmail: no-reply@verify.com",
                "isRead": false,
                "sentAt": 1720351200000,
                "removedAt": null,
                "from": "no-reply@verify.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e109",
                "createdAt": 1737205906000,
                "subject": "🎊 Congratulations! Job Offer - Senior Developer Position at TechCorp",
                "body": "Dear candidate,\n\nCongratulations! We are thrilled to extend this formal job offer for the position of Senior Developer at TechCorp.\n\nAfter careful consideration of your impressive background, technical expertise, and the excellent impression you made during our interview process, we are confident that you would be a valuable addition to our development team.\n\n**🏢 POSITION DETAILS:**\n\n**Role Information:**\n• **Position:** Senior Full-Stack Developer\n• **Department:** Engineering & Development\n• **Reports To:** Lead Engineering Manager\n• **Team Size:** 8 developers, 2 QA specialists\n• **Start Date:** [Proposed Date - 2 weeks from acceptance]\n• **Employment Type:** Full-time, permanent position\n\n**💰 COMPENSATION PACKAGE:**\n\n**Base Salary & Benefits:**\n• **Annual Salary:** $95,000 - $110,000 (based on experience)\n• **Signing Bonus:** $5,000 (paid after 90 days)\n• **Performance Bonus:** Up to 15% of annual salary\n• **Stock Options:** 1,000 shares vesting over 4 years\n• **Annual Raises:** Merit-based, typically 5-8%\n\n**🎯 COMPREHENSIVE BENEFITS:**\n\n**Health & Wellness:**\n• **Medical Insurance:** 100% premium coverage for you, 80% for family\n• **Dental & Vision:** Full coverage included\n• **Health Savings Account:** Company contributes $1,500 annually\n• **Life Insurance:** 2x annual salary coverage\n• **Disability Insurance:** Short and long-term coverage\n• **Employee Assistance Program:** Counseling and wellness support\n\n**Time Off & Flexibility:**\n• **Paid Time Off:** 20 days (increasing to 25 after 2 years)\n• **Sick Leave:** 10 days annually\n• **Personal Days:** 3 floating holidays\n• **Parental Leave:** 12 weeks paid leave\n• **Sabbatical Program:** 4 weeks after 5 years of service\n• **Flexible Work:** Hybrid remote/office schedule\n\n**🚀 CAREER DEVELOPMENT:**\n\n**Growth Opportunities:**\n• **Professional Development Budget:** $3,000 annually\n• **Conference Attendance:** 2 major conferences per year\n• **Certification Support:** Company pays for relevant certifications\n• **Mentorship Program:** Both mentoring and being mentored\n• **Internal Training:** Access to premium learning platforms\n• **Career Pathing:** Clear advancement opportunities\n\n**🛠️ TECHNICAL ENVIRONMENT:**\n\n**Technology Stack:**\n• **Frontend:** React, Vue.js, TypeScript, Next.js\n• **Backend:** Node.js, Python, Java, Go\n• **Database:** PostgreSQL, MongoDB, Redis\n• **Cloud:** AWS, Docker, Kubernetes\n• **Tools:** Git, Jira, Slack, VS Code\n• **DevOps:** CI/CD pipelines, automated testing\n\n**🏅 COMPANY CULTURE:**\n\n**What Makes Us Special:**\n• **Innovation-focused** - 20% time for personal projects\n• **Collaborative environment** - Cross-functional teams\n• **Work-life balance** - Flexible schedules and remote options\n• **Diverse and inclusive** - Committed to equal opportunity\n• **Learning culture** - Continuous improvement mindset\n• **Social impact** - Volunteer time and charity matching\n\n**📋 NEXT STEPS:**\n\n**To Accept This Offer:**\n1. Review all terms and conditions carefully\n2. Sign and return the attached offer letter\n3. Complete the background check process\n4. Provide references if not already submitted\n5. Schedule your first-day orientation\n\n**Timeline:**\n• **Offer Expires:** [Date - 1 week from today]\n• **Background Check:** 3-5 business days\n• **Proposed Start Date:** [Date]\n• **Orientation:** Full day program with HR and team\n\n**Questions?**\nPlease don't hesitate to reach out if you have any questions about this offer, benefits, or the role itself.\n\nWe're excited about the possibility of you joining our team and contributing to our continued success!\n\nBest regards,\n\nSarah Chen\nHR Director\nTechCorp\nPhone: +1 555-TECH-JOB\nEmail: hr@company.com",
                "isRead": true,
                "sentAt": 1737206002000,
                "removedAt": null,
                "from": "hr@company.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e110",
                "createdAt": 1682765400000,
                "subject": "הזמנה לוובינר",
                "body": "יש לנו וובינר מעניין שיתקיים ביום שלישי הקרוב, ואנחנו רוצים להזמין אותך אליו. במהלך הוובינר נשתף את כל המגמות החדשות בתחום, טיפים וטריקים למקסום ביצועים. אל תחמיץ את ההזדמנות ללמוד ממומחים בתחום!",
                "isRead": false,
                "sentAt": 1682765400000,
                "removedAt": null,
                "from": "webinars@events.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e111",
                "createdAt": 1741363331000,
                "subject": "Your Dream Vacation Package - Mediterranean Cruise Adventure Awaits!",
                "body": "Dear Alex,\n\nGreetings from the Wanderlust Travel Agency! I hope this email finds you planning your next amazing adventure.\n\nI'm reaching out with incredible news - we've just secured exclusive access to one of the most sought-after Mediterranean cruise experiences for this summer, and I immediately thought of you given your interest in European travel that you mentioned during our last conversation.\n\n**🚢 EXCLUSIVE MEDITERRANEAN ODYSSEY CRUISE 🚢**\n\n**Cruise Details:**\n• **Ship**: Royal Caribbean's Symphony of the Seas (One of the world's largest cruise ships!)\n• **Duration**: 12 days, 11 nights\n• **Departure**: July 15th, 2023 from Barcelona, Spain\n• **Return**: July 27th, 2023 to Rome, Italy\n• **Cabin**: Balcony Suite with Ocean View (Deck 9)\n\n**Your Incredible Itinerary:**\n🇪🇸 **Day 1-2: Barcelona, Spain**\n- Explore Gaudí's architectural masterpieces\n- Stroll through the Gothic Quarter\n- Experience the vibrant nightlife of Las Ramblas\n\n🇫🇷 **Day 3-4: Nice & Cannes, France**\n- Discover the glamorous French Riviera\n- Optional excursion to Monaco and Monte Carlo\n- Visit the famous Cannes Film Festival location\n\n🇮🇹 **Day 5-6: Rome & Florence, Italy**\n- Guided tour of the Colosseum and Vatican City\n- Day trip to Florence to see Michelangelo's David\n- Authentic Italian cooking class included\n\n🇬🇷 **Day 7-8: Santorini & Mykonos, Greece**\n- Witness the world-famous Santorini sunset\n- Explore the charming windmills of Mykonos\n- Swimming in crystal-clear Aegean waters\n\n🇹🇷 **Day 9-10: Istanbul, Turkey**\n- Visit the magnificent Hagia Sophia and Blue Mosque\n- Explore the Grand Bazaar for unique souvenirs\n- Traditional Turkish bath experience\n\n🇭🇷 **Day 11: Dubrovnik, Croatia**\n- Walk the ancient city walls\n- Game of Thrones filming location tour\n\n**Limited-time booking offer:**\nThis is an exclusive deal, and we have limited cabins available. Book your dream vacation by [insert link] and make unforgettable memories!\n\nLooking forward to hearing from you!\n\nBest regards,\nJessica Martinez\nWanderlust Travel Agency\nPhone: +1 555-123-4567\nEmail: jessica@wanderlust.com",
                "isRead": true,
                "sentAt": 1741363475000,
                "removedAt": null,
                "from": "jessica@wanderlust.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e112",
                "createdAt": 1685076720000,
                "subject": "🔥 Final Exclusive Sale - Up to 50% Off Everything! Limited Time Only",
                "body": "Hello Dear Customer!\n\nWe're thrilled to invite you to our biggest and final sale of the year! 🎉\n\n✨ Amazing discounts up to 50% on all products\n🎯 Limited time offer - Only 72 hours!\n📦 Free shipping on orders over $50\n🏷️ Special code: FINAL50\n\nThis is the perfect opportunity to grab those items you've been eyeing for so long. Stock is limited and these special prices are only available for a few days! Don't miss this golden opportunity.\n\nWhat's included in the sale:\n• Fashion & Clothing - Up to 45% off\n• Electronics & Gadgets - Up to 50% off\n• Home & Garden - Up to 40% off\n• Sports & Recreation - Up to 35% off\n\nOrder now and save significantly! Use code 'FINAL50' at checkout to unlock your discount.\n\nWarm regards,\nThe Sales Team 🛍️",
                "isRead": false,
                "sentAt": 1685076780000,
                "removedAt": null,
                "from": "sale@shopping.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e113",
                "createdAt": 1717755600000,
                "subject": "🎪 Exclusive Live Event - Amazing Digital Experience Awaits You! Thursday at 7:00 PM",
                "body": "Hello Dear Friend!\n\nWe're excited to invite you to our exclusive live event - an amazing digital experience you won't want to miss! 🚀\n\n📅 When: Next Thursday at 7:00 PM\n🎮 Where: Exclusive digital platform\n⏰ Duration: 90 minutes of fascinating content\n\nWhat awaits you at the event:\n🆕 Launch of innovative products for the first time\n💰 Exclusive discounts for participants only (up to 60%!)\n🎁 Raffle for a grand prize worth $1,200\n💡 Exciting insights about future projects\n🤝 Opportunity to meet the leading team\n👥 Network with other participants\n\nThe event will be broadcast live with real-time Q&A opportunities. You can win exclusive prizes and be the first to discover our exciting news.\n\nRegistration required - limited spots!\n\nWe look forward to seeing you there! 🌟\n\nBest regards,\nThe Events Team",
                "isRead": true,
                "sentAt": 1717762800000,
                "removedAt": null,
                "from": "events@company.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e114",
                "createdAt": 1685249280000,
                "subject": "💭 Your Feedback Matters! Share Your Experience and Get 10% Off + Special Gift",
                "body": "Hello Dear Customer!\n\nYour opinion is very important to us! 💪\n\nWe're looking to hear about your experience with the service you recently received. Your feedback helps us improve and ensure every customer gets an excellent experience.\n\n🎁 What awaits you upon completing the survey:\n• 10% discount on your next purchase\n• Free shipping coupon\n• Entry into monthly raffle for $120 voucher\n• Special gift from our new collection\n\n📊 The survey includes:\n✅ Short and simple questions (3-5 minutes)\n✅ Option to add personal comments\n✅ Suggestions for service improvement\n✅ Customer experience rating\n\nYour information is protected and will not be shared with third parties. We use it only to improve our service.\n\nYour contribution helps us provide better service and ensure every customer receives the best possible experience.\n\nThank you so much for your time and trust! 🙏\n\nBest regards,\nCustomer Service Team",
                "isRead": false,
                "sentAt": 1685249340000,
                "removedAt": null,
                "from": "feedback@company.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e115",
                "createdAt": 1685335680000,
                "subject": "📚 Limited Time Offer: 2 Courses for the Price of 1! Invest in Yourself with 50% Savings",
                "body": "Hello Dear Learner!\n\nTime to invest in yourself! 🎓\n\nWe're offering a special promotion - buy one course and get another absolutely free! This is the perfect opportunity to learn something new at no additional cost.\n\n🎯 Wide range of available courses:\n💻 Development & Programming (Python, JavaScript, React)\n📈 Digital Marketing & Social Media\n🎨 Graphic Design & UX/UI\n📊 Data Analysis & Advanced Excel\n🏢 Business Management & Entrepreneurship\n📱 Mobile App Development\n🔐 Information Security & Cybersecurity\n\n✨ What's special about our courses:\n• Leading instructors in the field\n• Updated and practical content\n• Industry-recognized certificates\n• Active community of learners\n• Lifetime access to content\n• Hands-on projects\n\n⏰ Offer expires in just 48 hours!\n\nDon't miss this opportunity to advance your career and acquire new skills. Investment in education is investment in your future.\n\nQuick registration through the attached link.\n\nGood luck with your studies! 🌟\n\nBest regards,\nThe Learning Team",
                "isRead": true,
                "sentAt": 1685335740000,
                "removedAt": null,
                "from": "courses@learning.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e116",
                "createdAt": 1692127200000,
                "subject": "🔔 Reminder: Exclusive Webinar Tomorrow! Innovative Tech Trends - 5:00 PM",
                "body": "Hello Friend!\n\nJust a friendly reminder that our exclusive webinar is happening tomorrow at 5:00 PM! 🚀\n\n🎯 Webinar Topic: \"Innovative Technology Trends 2024\"\n📅 When: Tomorrow, 5:00-6:30 PM\n🎙️ Who: Leading industry experts\n💻 Where: Exclusive digital platform\n\n🌟 What awaits you:\n• Fresh insights on AI and machine learning\n• Future trends in software development\n• Business opportunities in technology\n• Q&A session with experts\n• Networking with professionals\n• Exclusive learning materials\n\n👥 Featured speakers:\n• Dr. Sarah Johnson - AI Expert\n• Mike Chen - Chief Engineer at Tech Company\n• Lisa Rodriguez - Technology Consultant\n\nThe webinar will be recorded and available to participants who can't attend live.\n\nIf you haven't registered yet, now's the time! Limited spots available.\n\nSee you tomorrow! 👋\n\nBest regards,\nThe Webinar Team",
                "isRead": false,
                "sentAt": 1692213600000,
                "removedAt": null,
                "from": "webinars@events.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e117",
                "createdAt": 1747129778000,
                "subject": "🎉 Congratulations on Your New Job! Exclusive Career Development Package Awaits You",
                "body": "Huge congratulations on your new position! 🥳\n\nWe're thrilled to see your success and hope this new chapter brings you exciting challenges and amazing development opportunities.\n\n🎁 As a token of appreciation for your hard work, we're offering you an exclusive career development package:\n\n📋 What the package includes:\n• Personal consultation for writing winning resumes\n• Interview preparation with experts\n• Professional networking workshops\n• Personal mentoring for 3 months\n• Access to job opportunities platform\n• Digital tools for career management\n\n💡 Additional content:\n• Tips for improving professional presence\n• Strategies for workplace advancement\n• Personal branding building\n• Leadership skills development\n• Salary negotiation techniques\n\n🎯 The package is personally tailored to your field and career aspirations.\n\nGood luck in your new role! We're here to support you every step of the way.\n\nContact us for more details about the special package.\n\nBest wishes and great success! 🌟\n\nThe Career Team",
                "isRead": true,
                "sentAt": 1747129863000,
                "removedAt": null,
                "from": "careers@company.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e118",
                "createdAt": 1685594880000,
                "subject": "🎂 Happy Birthday! A special and surprising gift awaits you - a free month or a gift from the store",
                "body": "Happy Birthday! 🎉🎈\n\nWe send you warm wishes for a wonderful and successful year!\n\n🎁 To celebrate your special day, we’ve prepared an exclusive birthday gift for you:\n\n🎯 Choose your gift:\n🟢 Option 1: One free month of Premium subscription\n• Access to all exclusive content\n• Ad-free experience\n• Priority technical support\n• Advanced content\n\n🟢 Option 2: A gift from the store (choose from 20 products)\n• Tech accessories\n• Lifestyle products\n• Fashion items\n• Home and decor products\n\n✨ Additionally, you will receive:\n• A beautifully designed digital greeting card\n• 25% off your next purchase\n• Priority for event bookings\n• A chance to win the monthly birthday prize\n\n💌 This is our way of saying thank you for being a valued customer.\n\nEnjoy your special day and your gift! 🌟\n\nWith warm wishes and all the best,\nThe Gifts and Special Events Team",
                "isRead": false,
                "sentAt": 1685594940000,
                "removedAt": null,
                "from": "gifts@company.com",
                "to": "user@appsus.com",
                "isStared": true,
                "labels": []
            },
            {
                "id": "e119",
                "createdAt": 1685681280000,
                "subject": "🚚 Free shipping on all orders! 72 hours only - no minimum purchase",
                "body": "Dear Customer,\n\nGreat news! 🎉\n\nWe’re offering free shipping on all orders for the next 72 hours - with no minimum purchase required!\n\n📦 Offer details:\n• Free shipping nationwide\n• No quantity or amount limit\n• Delivery time: 1-3 business days\n• Option for self-pickup\n• Real-time tracking\n\n🛍️ What to order:\n💻 New gadgets and electronics\n👕 Trendy fashion and accessories\n🏠 Home and design products\n🎮 Games and toys\n📚 Books and study materials\n🎨 Craft supplies and tools\n\n💡 Extra savings tips:\n• Combine orders from different categories\n• Check out sale items\n• Use the coupon code FREESHIP\n• Subscribe to the newsletter for updates\n\n⏰ The offer ends in just 72 hours!\n\nEnjoy your shopping experience with fast and perfect delivery right to your doorstep.\n\nHappy shopping! 🛒\n\nBest regards,\nThe Online Store Team",
                "isRead": true,
                "sentAt": 1685681340000,
                "removedAt": null,
                "from": "shop@company.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
                "id": "e120",
                "createdAt": 1685767680000,
                "subject": "🔄 Subscription renewal reminder - opportunity for upgrade at a special price and additional benefits",
                "body": "Dear Customer,\n\nThis is a friendly reminder that your subscription is about to renew soon. 📅\n\n🎯 We want to make sure you get the best value for your needs.\n\n💎 Available upgrade options:\n\n🥈 Silver subscription (upgrade from basic):\n• Additional exclusive content\n• Priority technical support\n• Early access to updates\n• Personal preference storage\n\n🥇 Gold subscription (recommended):\n• Unlimited access to all content\n• Monthly personal consultation\n• Advanced tools\n• Exclusive discounts\n• Enhanced data backup\n\n💠 Platinum subscription (for businesses):\n• Organizational solutions\n• Dedicated account manager\n• Team training\n• Advanced reporting\n• Enhanced security\n\n🎁 Special benefits for renewal:\n• 20% discount on upgrade\n• One month free trial\n• Full data transfer\n• Cancel anytime\n• Money-back guarantee\n\n📞 Have questions? Our support team is here for you:\n• 24/7 live chat\n• Email support\n• Detailed help guides\n• Video tutorials\n\nThank you for choosing us! We are here to provide you with the best service.\n\nBest regards,\nThe Support and Subscription Team",
                "isRead": false,
                "sentAt": 1685767740000,
                "removedAt": null,
                "from": "support@company.com",
                "to": "user@appsus.com",
                "isStared": false,
                "labels": []
            },
            {
    "id": "e121",
    "createdAt": 1719766492000,
    "subject": "Weekend Plans - Beach Trip Organization",
    "body": "Hey there!\n\nI hope you're having a great week! I wanted to reach out about organizing that beach trip we talked about.\n\n**Trip Details:**\n• Date: Next Saturday, July 20th\n• Location: Sunset Beach - the one with the amazing seafood restaurant\n• Time: Meet at 9:00 AM for carpooling\n• Duration: Full day adventure\n\n**What to Bring:**\n• Sunscreen (SPF 30+)\n• Beach towels and comfortable chairs\n• Snacks and plenty of water\n• Volleyball or frisbee for beach games\n• Camera for capturing memories\n\n**Food Plans:**\n• Lunch at the beachside café around 1:00 PM\n• I'll bring homemade sandwiches as backup\n• Evening BBQ at the designated grilling area\n\nLet me know if you're still interested and if you need a ride! Also, feel free to invite anyone else who might want to join our little beach adventure.\n\nLooking forward to some sun, sand, and great company!\n\nCheers,\nSarah\n\nP.S. The weather forecast looks perfect - sunny with a gentle breeze!",
    "isRead": false,
    "sentAt": 1719766587000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "sarah.beach@gmail.com",
    "isStared": false,
    "labels": []
  },
  {
    "id": "e122",
    "createdAt": 1704067200000,
    "subject": "Recipe Exchange - Grandma's Secret Chocolate Cake",
    "body": "Hi my dear friend!\n\nI hope this email finds you in good health and spirits!\n\nRemember how you absolutely loved my grandmother's chocolate cake at last month's dinner party? Well, I finally convinced her to share the secret family recipe, and I'm excited to pass it on to you!\n\n**Grandma Rose's Famous Chocolate Cake Recipe:**\n\n**Ingredients:**\n• 2 cups all-purpose flour\n• 2 cups granulated sugar\n• 3/4 cup unsweetened cocoa powder\n• 2 teaspoons baking soda\n• 1 teaspoon baking powder\n• 1 teaspoon salt\n• 2 eggs\n• 1 cup buttermilk\n• 1/2 cup vegetable oil\n• 1 teaspoon vanilla extract\n• 1 cup hot coffee (the secret ingredient!)\n\n**The Secret Tips:**\n• Add the hot coffee at the end - it makes the chocolate flavor richer\n• Don't overmix the batter\n• Use room temperature ingredients\n• Bake at 350°F for 30-35 minutes\n\n**Frosting Recommendation:**\n• Cream cheese frosting pairs beautifully\n• Add a touch of espresso powder for extra depth\n\nI can't wait to hear how it turns out for you! Feel free to experiment with the frosting - grandma always said cooking is about making it your own.\n\nHappy baking!\n\nWith love and flour-covered hugs,\nEmily\n\nP.S. If you try it, please send me a photo!",
    "isRead": true,
    "sentAt": 1704067260000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "emily.baking@hotmail.com",
    "isStared": true,
    "labels": []
  },
  {
    "id": "e123",
    "createdAt": 1721356800000,
    "subject": "Urgent: Server Maintenance Window Tonight",
    "body": "Dear Team,\n\nI hope everyone is having a productive day!\n\nThis is an urgent notification regarding scheduled server maintenance that will affect our production environment.\n\n**Maintenance Details:**\n• **Date:** Tonight, July 19th\n• **Time:** 11:00 PM - 3:00 AM (4-hour window)\n• **Affected Services:** Main application, database, and API endpoints\n• **Expected Downtime:** Approximately 2 hours\n\n**What's Being Updated:**\n• Security patches for operating system\n• Database performance optimizations\n• SSL certificate renewal\n• Load balancer configuration updates\n\n**Preparation Required:**\n• Backup all current work before 10:30 PM\n• Inform any active users about the maintenance window\n• Prepare rollback procedures if needed\n• Have emergency contact numbers ready\n\n**Communication Plan:**\n• Status updates every 30 minutes during maintenance\n• Slack channel #maintenance-updates for real-time info\n• Email notification when services are restored\n\n**Emergency Contacts:**\n• Primary: Michael Torres (555-123-4567)\n• Secondary: Lisa Chen (555-987-6543)\n• Escalation: David Kim (555-456-7890)\n\nThank you for your understanding and cooperation!\n\nBest regards,\nIT Operations Team\ntech.support@company.com",
    "isRead": false,
    "sentAt": 1721356860000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "tech.support@company.com",
    "isStared": false,
    "labels": []
  },
  {
    "id": "e124",
    "createdAt": 1709068800000,
    "subject": "Book Club Discussion - This Month's Selection",
    "body": "Hello fellow book lovers!\n\nI hope everyone is enjoying our current selection and finding time to read despite busy schedules!\n\nAs we approach our monthly meeting, I wanted to share some discussion points and updates about our book club.\n\n**Current Book: \"The Seven Husbands of Evelyn Hugo\"**\n• **Meeting Date:** Thursday, March 7th at 7:00 PM\n• **Location:** Central Library, Meeting Room 3\n• **Virtual Option:** Zoom link will be sent separately\n\n**Discussion Questions to Consider:**\n• How did Evelyn's storytelling style affect your reading experience?\n• What themes resonated most with you?\n• Which character relationships felt most authentic?\n• How did the historical context enhance the narrative?\n\n**Book Club Updates:**\n• **Next Month's Selection:** \"Klara and the Sun\" by Kazuo Ishiguro\n• **New Member Welcome:** Please join me in welcoming Jennifer and Marcus!\n• **Spring Reading Challenge:** We're starting next month - get ready!\n\n**Refreshments:**\n• I'll bring my famous lemon bars\n• Coffee and tea will be provided\n• Please let me know if you have any dietary restrictions\n\n**Upcoming Events:**\n• Author visit in April (details to follow)\n• Annual book swap in May\n• Poetry reading night in June\n\nLooking forward to our thoughtful discussion and literary insights!\n\nHappy reading,\nBookworm Betty\nbetty@readingcircle.com\n\nP.S. Don't forget to bring your favorite bookmarks to share!",
    "isRead": true,
    "sentAt": 1709068860000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "betty@readingcircle.com",
    "isStared": false,
    "labels": []
  },
            {
    "id": "e125",
    "createdAt": 1722470400000,
    "subject": "Photography Workshop - Capturing Nature's Beauty",
    "body": "Hello Photography Enthusiasts!\n\nGreetings from the world of apertures, shutter speeds, and perfect lighting!\n\nI'm excited to invite you to our upcoming nature photography workshop that promises to enhance your skills and inspire your creative vision.\n\n**Workshop Details:**\n• **Title:** \"Mastering Natural Light in Landscape Photography\"\n• **Date:** Saturday, August 10th\n• **Time:** 6:00 AM - 4:00 PM (early start for golden hour!)\n• **Location:** Mountain View Nature Reserve\n• **Cost:** $85 per person (includes lunch and materials)\n\n**What We'll Cover:**\n• **Golden Hour Techniques** - Making the most of magical morning light\n• **Composition Rules** - Rule of thirds, leading lines, and framing\n• **Camera Settings** - Manual mode mastery for landscapes\n• **Post-Processing Basics** - Lightroom fundamentals\n\n**What to Bring:**\n• DSLR or mirrorless camera\n• Tripod (essential for sharp images)\n• Extra batteries and memory cards\n• Comfortable hiking boots\n• Weather-appropriate clothing\n• Packed breakfast and snacks\n\n**Instructor Background:**\n• 15+ years of professional nature photography\n• Published in National Geographic and Nature Magazine\n• Specializes in landscape and wildlife photography\n\n**Bonus Features:**\n• Photo critique session\n• Equipment testing station\n• Networking with fellow photographers\n• Digital resource packet\n\nSpaces are limited to 12 participants for personalized attention!\n\nReady to capture nature's stunning beauty?\n\nShutter clicks and happy trails,\nAlex Camera\nphoto.workshop@nature.com\n\nP.S. Weather permitting - we'll have a backup indoor studio session if needed!",
    "isRead": false,
    "sentAt": 1722470460000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "photo.workshop@nature.com",
    "isStared": true,
    "labels": []
  },
  {
    "id": "e126",
    "createdAt": 1706832000000,
    "subject": "Fitness Challenge - 30 Days to Better Health",
    "body": "Hey Fitness Warriors!\n\nI hope this message finds you ready to crush your health and wellness goals!\n\nI'm thrilled to announce our community fitness challenge that's designed to boost energy, build strength, and create lasting healthy habits.\n\n**Challenge Overview:**\n• **Duration:** 30 days starting Monday, February 5th\n• **Goal:** Consistent daily movement and nutrition awareness\n• **Commitment:** Just 30 minutes of activity per day\n• **Community:** Support group with weekly check-ins\n\n**Daily Activities Include:**\n• **Week 1:** Foundation building - walking, stretching, bodyweight exercises\n• **Week 2:** Strength focus - resistance training, core work\n• **Week 3:** Cardio boost - dancing, jogging, cycling\n• **Week 4:** Integration - combining all elements\n\n**Nutrition Component:**\n• Daily hydration goals (8 glasses of water)\n• Mindful eating practices\n• One healthy meal prep session per week\n• Optional: food diary for awareness\n\n**Challenge Perks:**\n• **Weekly Prizes:** Fitness gear, healthy snacks, gym passes\n• **Progress Tracking:** Custom app with achievement badges\n• **Expert Support:** Nutritionist and trainer Q&A sessions\n• **Community Events:** Group workouts and healthy cooking demos\n\n**Getting Started:**\n• Complete the fitness assessment form\n• Join our private Facebook group\n• Download the tracking app\n• Set your personal goals\n\n**Registration:**\n• **Cost:** $25 (covers materials and prizes)\n• **Deadline:** Friday, February 2nd\n• **Sign-up:** fitness.challenge@healthy.com\n\nLet's make this month count toward a healthier, stronger you!\n\nStay strong and keep moving,\nCoach Maria\nfitness.challenge@healthy.com\n\nP.S. Beginners are absolutely welcome - we'll modify everything to fit your fitness level!",
    "isRead": true,
    "sentAt": 1706832060000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "fitness.challenge@healthy.com",
    "isStared": false,
    "labels": []
  },
  {
    "id": "e127",
    "createdAt": 1723075200000,
    "subject": "Garden Club Meeting - Summer Planting Tips",
    "body": "Dear Green Thumbs and Plant Lovers!\n\nI hope your gardens are flourishing and bringing you joy this beautiful season!\n\nIt's time for our monthly garden club meeting, and I'm excited to share what we have planned for this gathering of fellow gardening enthusiasts.\n\n**Meeting Information:**\n• **Date:** Wednesday, August 14th\n• **Time:** 6:30 PM - 8:30 PM\n• **Location:** Community Center, Room 15\n• **Theme:** \"Summer Success: Heat-Tolerant Plants and Water-Wise Gardening\"\n\n**This Month's Agenda:**\n• **Guest Speaker:** Master Gardener Susan Green\n  - Topic: \"Drought-Resistant Landscaping\"\n  - Q&A session for your specific gardening challenges\n\n• **Member Presentations:**\n  - Tom's tomato growing secrets\n  - Lisa's herb garden harvest tips\n  - Mark's composting success story\n\n• **Hands-On Activity:**\n  - Seed starting workshop for fall vegetables\n  - Take-home starter pots for everyone\n\n**Plant Swap Corner:**\n• Bring cuttings, seeds, or small plants to share\n• Popular items: succulents, herbs, perennials\n• Label your contributions with care instructions\n\n**Upcoming Events:**\n• **September 15th:** Garden tours of member spaces\n• **October 10th:** Fall planting workshop\n• **November 5th:** Harvest festival and recipe exchange\n\n**Refreshments:**\n• Lemonade and iced tea\n• Fresh fruit from member gardens\n• Homemade cookies (thank you, volunteers!)\n\nDon't forget to bring your gardening questions and stories to share!\n\nGardening regards,\nRose Petals\nPresident, Sunny Gardens Club\nrose@gardenclub.com\n\nP.S. We're still looking for volunteers to help with our community vegetable garden project!",
    "isRead": false,
    "sentAt": 1723075260000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "rose@gardenclub.com",
    "isStared": false,
    "labels": []
  },
  {
    "id": "e128",
    "createdAt": 1714608000000,
    "subject": "Tech Conference Update - Speaker Schedule Released",
    "body": "Hello Tech Community!\n\nI hope everyone is as excited as I am about the upcoming innovation conference!\n\nI'm thrilled to share the final speaker lineup and schedule for our annual tech gathering that promises to be our most inspiring event yet.\n\n**Conference Details:**\n• **Event:** \"Future Forward: Technology Trends 2024\"\n• **Date:** September 12-14, 2024\n• **Location:** Downtown Convention Center\n• **Attendance:** 500+ professionals from across the industry\n\n**Keynote Speakers:**\n• **Dr. Sarah Martinez** - \"AI Ethics in the Modern Workplace\"\n• **Michael Chen** - \"Sustainable Technology Solutions\"\n• **Lisa Rodriguez** - \"The Future of Remote Collaboration\"\n\n**Workshop Sessions:**\n• **Day 1:** Cloud Computing and Security\n• **Day 2:** Mobile Development Best Practices\n• **Day 3:** Data Science and Machine Learning\n\n**Networking Opportunities:**\n• Opening reception with industry leaders\n• Speed networking sessions\n• Startup showcase and pitch competition\n• Closing celebration with live music\n\n**Registration Information:**\n• **Early Bird:** $299 (ends July 31st)\n• **Regular:** $399 (after August 1st)\n• **Student Discount:** 50% off with valid ID\n• **Group Rates:** 20% off for teams of 5+\n\n**What's Included:**\n• All sessions and workshops\n• Conference materials and swag bag\n• Breakfast and lunch for all three days\n• Access to networking events\n• Digital resource library\n\n**Hotel Accommodations:**\n• Partner hotels offering conference rates\n• Shuttle service to and from venue\n• Booking deadline: August 15th\n\nRegister now at: tech.conference@innovation.com\n\nLooking forward to three days of learning, networking, and innovation!\n\nBest regards,\nThe Conference Planning Team\ntech.conference@innovation.com\n\nP.S. Follow us on social media for speaker spotlights and behind-the-scenes content!",
    "isRead": true,
    "sentAt": 1714608060000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "tech.conference@innovation.com",
    "isStared": true,
    "labels": []
  },
  {
    "id": "e129",
    "createdAt": 1712016000000,
    "subject": "Volunteer Opportunity - Community Food Drive",
    "body": "Dear Community Champions!\n\nI hope this message finds you well and ready to make a positive impact in our neighborhood!\n\nI'm reaching out to invite you to participate in our upcoming community food drive - an opportunity to help families in need while bringing our community together.\n\n**Food Drive Details:**\n• **Event:** \"Neighbors Helping Neighbors Food Collection\"\n• **Date:** April 10-17, 2024\n• **Goal:** 5,000 pounds of food donations\n• **Beneficiary:** Local food bank serving 200+ families monthly\n\n**How You Can Help:**\n• **Donate Food Items:** Non-perishable goods, canned vegetables, pasta, rice\n• **Volunteer Time:** Sorting, packing, and distribution assistance\n• **Spread the Word:** Share with friends, family, and coworkers\n• **Monetary Donations:** $1 provides 3 meals through bulk purchasing\n\n**Most Needed Items:**\n• Canned proteins (tuna, chicken, beans)\n• Whole grain cereals and oatmeal\n• Peanut butter and other nut butters\n• Canned fruits and vegetables\n• Baby food and formula\n• Personal hygiene items\n\n**Volunteer Opportunities:**\n• **Collection Day:** April 10th, 9 AM - 5 PM\n• **Sorting Sessions:** April 11-16, various times\n• **Distribution Day:** April 17th, 8 AM - 3 PM\n• **Setup/Cleanup:** Flexible scheduling available\n\n**Drop-Off Locations:**\n• Community Center (main collection point)\n• Local grocery stores (marked bins)\n• Schools and libraries\n• Religious centers\n\n**Recognition:**\n• Volunteer appreciation lunch\n• Community service certificates\n• Social media recognition\n• Thank you notes from recipient families\n\nEvery contribution, no matter the size, makes a meaningful difference in someone's life!\n\nTogether we can fight hunger,\nCommunity Outreach Team\nvolunteer@community.org\n\nP.S. Students can earn community service hours - perfect for college applications!",
    "isRead": false,
    "sentAt": 1712016060000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "volunteer@community.org",
    "isStared": false,
    "labels": []
  },
  {
    "id": "e130",
    "createdAt": 1718236800000,
    "subject": "Movie Night Planning - Summer Film Series",
    "body": "Hey Movie Buffs!\n\nI hope you're ready for another fantastic evening of cinema under the stars!\n\nOur summer outdoor movie series has been such a hit, and I'm excited to share the lineup for our remaining screenings this season.\n\n**Upcoming Movie Nights:**\n• **June 26th:** \"The Princess Bride\" (Classic Adventure)\n• **July 9th:** \"Spider-Man: Into the Spider-Verse\" (Animated Action)\n• **July 23rd:** \"Mamma Mia!\" (Musical Comedy)\n• **August 6th:** \"The Martian\" (Sci-Fi Drama)\n\n**Event Details:**\n• **Location:** Central Park Amphitheater\n• **Time:** Gates open at 7:00 PM, movie starts at sunset\n• **Admission:** Free! (donations appreciated)\n• **Parking:** Available in adjacent lots\n\n**What to Bring:**\n• Blankets and lawn chairs for comfortable seating\n• Snacks and drinks (no alcohol please)\n• Bug spray and light jackets for evening coolness\n• Cash for concession stand treats\n\n**Concession Stand:**\n• Fresh popcorn and candy\n• Hot dogs and nachos\n• Soft drinks and bottled water\n• Ice cream treats\n• All proceeds support local youth programs\n\n**Special Features:**\n• Pre-movie trivia contests with prizes\n• Live music performances before screenings\n• Photo booth with movie-themed props\n• Family-friendly activities for kids\n\n**Volunteer Opportunities:**\n• Setup and cleanup crews needed\n• Concession stand helpers\n• Parking assistance\n• Technical support team\n\n**Weather Policy:**\n• Events proceed rain or shine\n• Covered pavilion available during light rain\n• Severe weather cancellations posted on social media\n\nBring your friends and family for these magical movie nights!\n\nLights, camera, action!\nSummer Events Committee\nmovies@summerpark.com\n\nP.S. Don't forget to vote for next year's movie selections on our website!",
    "isRead": true,
    "sentAt": 1718236860000,
    "removedAt": null,
    "from": "user@appsus.com",
    "to": "movies@summerpark.com",
    "isStared": false,
    "labels": []
  },
    {
    "id": "e131",
    "createdAt": 1719700000000,
    "subject": "🎉 You're Invited to Our Annual Summer Bash!",
    "body": "Hey there!\n\nGet ready to soak up the sun and have a blast at our annual Summer Bash this Saturday at Central Park!\n\n**What to Expect:**\n• Live music\n• Food trucks\n• Lawn games & prizes\n• Family and pet-friendly fun\n\n📅 Date: Saturday, July 12\n🕒 Time: 1:00 PM - 6:00 PM\n📍 Location: Central Park, Meadow Area\n\nLet us know if you're coming by RSVPing at: events@sunclub.com\n\nSee you there!\n- The SunClub Team",
    "isRead": false,
    "sentAt": 1719700100000,
    "removedAt": 1719800000000,
    "from": "events@sunclub.com",
    "to": "user@appsus.com",
    "isStared": false,
    "labels": ["promotions"]
  },
  {
    "id": "e132",
    "createdAt": 1725201200000,
    "subject": "🛠️ Support Ticket #43921 - We've Resolved Your Issue",
    "body": "Hi,\n\nThanks for reaching out to our support team. We’ve reviewed your report regarding the login issue on the mobile app.\n\n✅ **Resolution Summary:**\n• Issue: Login button unresponsive on Android 14\n• Action Taken: Released hotfix v2.1.3\n• Status: Resolved\n\nPlease update the app to the latest version. If you continue to face any problems, reply to this email or open a new ticket.\n\nThanks for your patience!\n- Support Team",
    "isRead": true,
    "sentAt": 1725201300000,
    "removedAt": 1725280000000,
    "from": "support@techflow.com",
    "to": "user@appsus.com",
    "isStared": false,
    "labels": ["support"]
  },
  {
    "id": "e133",
    "createdAt": 1740000000000,
    "subject": "⚠️ Security Alert: New Login from Unrecognized Device",
    "body": "Hello,\n\nWe detected a login to your account from a new device:\n\n📍 Location: Tel Aviv, Israel\n💻 Device: Windows 11 - Chrome\n🕒 Time: 2025-06-01 15:23 GMT+3\n\nIf this was you, no further action is needed.\nIf you don't recognize this activity, we strongly recommend:\n1. Resetting your password immediately\n2. Enabling 2-factor authentication\n\nStay safe,\nSecurity Team",
    "isRead": false,
    "sentAt": 1740000010000,
    "removedAt": 1740004000000,
    "from": "security@securemail.com",
    "to": "user@appsus.com",
    "isStared": true,
    "labels": ["security", "alerts"]
  },
  {
    "id": "e134",
    "createdAt": 1745600000000,
    "subject": "Invoice #45213 - Payment Confirmation",
    "body": "Dear Customer,\n\nThank you for your payment.\n\n**Invoice Details:**\n• Invoice #: 45213\n• Amount: $320.00\n• Date Paid: July 3, 2025\n• Payment Method: Credit Card\n\nYour transaction has been successfully processed.\nIf you have any questions, please reply to this email.\n\nBest regards,\nBilling Department",
    "isRead": true,
    "sentAt": 1745600100000,
    "removedAt": 1745690000000,
    "from": "billing@cloudwise.com",
    "to": "user@appsus.com",
    "isStared": false,
    "labels": ["finance"]
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
        if (value !== null) {
            if (value === 'true') {
                filterBy[field] = true;
            } else if (value === 'false') {
                filterBy[field] = false;
            } else {
                filterBy[field] = value
            }
        } else {
            filterBy[field] = defaultFilter[field]
        }
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

