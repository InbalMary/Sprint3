import { loadFromStorage, makeId, saveToStorage } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    addReview,
    getEmptyRev,
    removeReview,
    addGoogleBook,
    getCategories,
    getFilterFromSearchParams
}

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.subtitle) {
                const regExp = new RegExp(filterBy.subtitle, 'i')
                books = books.filter(book => regExp.test(book.subtitle))
            }
            if (filterBy.authors && typeof filterBy.authors === 'string' && filterBy.authors.trim() !== '') {
                const authorToFilter = filterBy.authors.toLowerCase()
                books = books.filter(book =>
                    book.authors.some(author => author.toLowerCase().includes(authorToFilter))
                )
            }
            if (filterBy.publishedDate) {
                books = books.filter(book => book.publishedDate === filterBy.publishedDate)
            }
            if (filterBy.description) {
                const regExp = new RegExp(filterBy.description, 'i')
                books = books.filter(book => regExp.test(book.description))
            }
            if (filterBy.pageCount) {
                books = books.filter(book => book.pageCount >= filterBy.pageCount)
            }
            if (filterBy.categories && filterBy.categories.length > 0) {
                books = books.filter(book =>
                    book.categories.some(category => filterBy.categories.includes(category))
                )
            }
            if (filterBy.language) {
                books = books.filter(book => book.language === filterBy.language)
            }
            if (filterBy.listPrice && filterBy.listPrice.amount) {
                books = books.filter(book => book.listPrice.amount <= filterBy.listPrice.amount)
            }
            if (filterBy.listPrice && filterBy.listPrice.isOnSale !== null) {
                books = books.filter(book => book.listPrice.isOnSale === filterBy.listPrice.isOnSale)
            }
            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId)
        .then(_setNextPrevBookId)
}

function remove(bookId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    // if (!book.id) return storageService.post(BOOK_KEY, book)

    // return get(book.id)
    //     .then(() => {
    //         return storageService.put(BOOK_KEY, book)
    //     })
    //     .catch(() => {
    //         return storageService.post(BOOK_KEY, book)
    //     })

    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}

function getEmptyBook(title = '', amount = 0) {
    return {
        id: '',
        title,
        subtitle: utilService.makeLorem(4),
        authors: [],
        publishedDate: utilService.getRandomIntInclusive(1950, 2024),
        description: utilService.makeLorem(20),
        pageCount: utilService.getRandomIntInclusive(20, 600),
        categories: [],
        thumbnail: 'https://covers.openlibrary.org/b/id/10523325-L.jpg',
        language: 'en',
        listPrice: {
            amount,
            currencyCode: 'EUR',
            isOnSale: Math.random() > 0.7
        }
    }
}

function getDefaultFilter() {
    return {
        title: '',
        subtitle: '',
        authors: [],
        publishedDate: null,
        description: '',
        pageCount: 0,
        categories: [],
        thumbnail: '',
        language: '',
        listPrice: {
            amount: 0,
            currencyCode: '',
            isOnSale: null
        }
    }
}

function getFilterFromSearchParams(searchParams) {
    return {
        title: searchParams.get('title') || '',
        subtitle: searchParams.get('subtitle') || '',
        authors: searchParams.get('authors') ? searchParams.get('authors').split(',') : [],
        publishedDate: searchParams.get('publishedDate') || null,
        description: searchParams.get('description') || '',
        pageCount: +searchParams.get('pageCount') || 0,
        categories: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
        thumbnail: searchParams.get('thumbnail') || '',
        language: searchParams.get('language') || '',
        amount: +searchParams.get('amount') || 0,
        currencyCode: searchParams.get('currencyCode') || '',
        isOnSale: searchParams.get('isOnSale') === 'true' ? true : 
                  searchParams.get('isOnSale') === 'false' ? false : null
    }
}

function _createBooks() {
    let books = loadFromStorage(BOOK_KEY)
    if (!books || !books.length) {
        const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']
        const books = []
        for (let i = 0; i < 20; i++) {
            const book = {
                id: utilService.makeId(),
                title: utilService.makeLorem(2),
                subtitle: utilService.makeLorem(4),
                authors: [
                    utilService.makeLorem(1)
                ],
                publishedDate: utilService.getRandomIntInclusive(1950, 2024),
                description: utilService.makeLorem(20),
                pageCount: utilService.getRandomIntInclusive(20, 600),
                categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
                thumbnail: `http://coding-academy.org/books-photos/${i + 1}.jpg`,
                language: "en",
                listPrice: {
                    amount: utilService.getRandomIntInclusive(80, 500),
                    currencyCode: "EUR",
                    isOnSale: Math.random() > 0.7
                }
            }
            books.push(book)
        }
        console.log('books', books)
        saveToStorage(BOOK_KEY, books)
    }
}

// function _createBook(title, amount = 109) {
//     const book = getEmptyBook(title, amount)
//     book.id = makeId()
//     return book
// }

function getCategories() {
    return query().then(books =>
        [...new Set(books.flatMap(book => book.categories))]

    )
}

function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function addReview(bookId, review) {
    review.id = makeId()
    return get(bookId)
        .then(book => {
            if (!Array.isArray(book.reviews)) book.reviews = []

            book.reviews.unshift(review)
            return save(book)
        })
}

function getEmptyRev() {
    return {
        // id: makeId(), //move to addrev
        fullName: '',
        rating: 1,
        readAt: utilService.formatDateForInput(new Date()),
        reviewText: ''
    }
}

function removeReview(bookId, revId) {
    return get(bookId).then(book => {
        book.reviews = (book.reviews || []).filter(rev => rev.id !== revId)
        return save(book)
    })
}

function addGoogleBook(item) {
    const book = { ...getEmptyBook(), ...item }
    console.log('item in add google book', item)
    return save(book)

}


