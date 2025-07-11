export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getRandomColor,
    padNum,
    getDayName,
    getMonthName,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    debounce,
    getTruthyValues,
    formatTimestamp,
    formatUrlToHtml,
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return JSON.parse(val)
}

function makeId(length = 6) {
    var txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getDayName(date, locale) {
    date = new Date(date)
    return date.toLocaleDateString(locale, { weekday: 'long' })
}


function getMonthName(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    return monthNames[date.getMonth()]
}

function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function debounce(func, delay) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

function getTruthyValues(obj) {
    const newObj = {}
    for (const key in obj) {
        const value = obj[key]
        if (typeof value === 'boolean' || value) {
            newObj[key] = value
        }
    }
    return newObj
}

function formatTimestamp(timestamp) {
    const now = new Date()
    const mailDate = new Date(timestamp)

    const diffInMs = now - mailDate
    const oneDayInMs = 24 * 60 * 60 * 1000
    const oneYearInMs = 365 * oneDayInMs

    if (diffInMs <= oneDayInMs) {
        return mailDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (diffInMs <= oneYearInMs) {
        return mailDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
        })
    }
    const day = mailDate.getDate()
    const month = mailDate.getMonth() + 1
    const year = mailDate.getFullYear().toString().slice(-2)

    return `${day}/${month}/${year}`
}


function formatUrlToHtml(cmpType, url) {
    if (!url) return ''

    if (cmpType === 'image') {
        return `<img src="${url}" style="max-width: 100%;" />`
    }

    if (cmpType === 'video') {
        let videoId = null
        if (url.includes('youtube.com/watch?v=')) {
            videoId = new URL(url).searchParams.get('v')
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]
        }
        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`
            return `<iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width: 100%; height: 200px;"></iframe>`
        }
        // fallback to raw iframe for other video URLs
        return `<iframe src="${url}" frameborder="0" allowfullscreen style="width: 100%; height: 200px;"></iframe>`
    }

    // fallback, just return the raw url as a link
    return `<a href="${url}" target="_blank">${url}</a>`
}

//SIMPLER VERSION
// export function formatUrlToHtml(cmpType, url) {
//   if (cmpType === 'image') {
//     return `<img src="${url}" style="max-width: 100%;"/>`
//   }
//   if (cmpType === 'video') {
//     return `<iframe src="${url}" frameborder="0" allowfullscreen style="width: 100%; height: 200px;"></iframe>`
//   }
//   return url
// }

