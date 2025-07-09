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
                "id": "e101",
                "createdAt": 1719766492000,
                "subject": "Miss You - Let's Catch Up Over Coffee Soon!",
                "body": "Hey Alex!\n\nI hope this message finds you well and thriving in all your endeavors! \n\nIt's been way too long since we last connected, and I've been thinking about our amazing conversations and the great times we've shared. Life has been keeping me busy with work projects and family commitments, but I realized I haven't made enough time for the people who matter most to me.\n\n**What I've been up to:**\n• Just finished a major project at work - finally launched that app we discussed!\n• Started taking pottery classes (who knew I had hidden artistic talents?)\n• Been exploring new hiking trails around the city\n• Reading some fantastic books I think you'd love\n\n**I'd love to hear about:**\n• How your new job is going - are you still loving the creative freedom?\n• Any new hobbies or interests you've picked up\n• Your thoughts on that documentary series we both wanted to watch\n• Plans for the upcoming season\n\nHow about we meet up for coffee at our favorite spot downtown? I'm free most evenings next week, and weekends work great too. We could also do a video call if that's more convenient - I just miss our chats!\n\nLet me know what works for your schedule. Can't wait to catch up properly!\n\nMissing our friendship,\nMomo\n\nP.S. I still have that book you recommended - finally ready to dive in!",
                "isRead": false,
                "sentAt": 1719766587000,
                "removedAt": null,
                "from": "momo@momo.com",
                "to": "user@appsus.com",
                "isStared": false
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
                "isStared": true
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
                "isStared": false
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
                "isStared": true
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
                "isStared": true
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
                "isStared": false
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
                "isStared": false
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
                "isStared": false
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
                "isStared": false
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
                "isStared": true
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
                "isStared": true
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
                "isStared": false
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
                "isStared": true
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
                "isStared": false
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
                "isStared": true
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
                "isStared": false
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
                "isStared": false
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
                "isStared": true
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
                "isStared": false
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
                "isStared": false
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

