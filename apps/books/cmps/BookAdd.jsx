import { googleBookService } from '../services/google-book.service.js'
import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { BookList } from "../cmps/BookList.jsx"

const { useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function BookAdd() {
    const [searchTerm, setSearchTerm] = useState('')
    const [books, setBooks] = useState([])
    const debouncedSearchTermRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        debouncedSearchTermRef.current = googleBookService.debounce(getTermSearch, 1500)
    }, [])

    // useEffect(() => {
    //     console.log('searchTerm changed- inside useeffecr ', searchTerm)
    //     if (debouncedSearchTermRef.current) {
    //         debouncedSearchTermRef.current(searchTerm)
    //     }
    // }, [searchTerm])

    useEffect(() => {
        // console.log('books', books)
    }, [books])

    function getTermSearch(term) {
        // console.log('term from getTermSearch: ', term)
        if (term) {
            googleBookService.query(term)
                .then((data) => {
                    // console.log('data', data)
                    setBooks(data)
                })
                .catch(err => {
                    // console.error('Search failed:', err)
                })
        } else {
            setBooks([])
        }
    }

    function onSearchGoogleAPI(ev) {
        ev.preventDefault()
        getTermSearch(searchTerm)
        // googleBookService.query(searchTerm)
        //     .then((data) => {
        //         console.log('data', data)
        //         setBooks(data)
        //     })
    }

    function onAddGoogleBook(book) {
        // console.log('book on onaddgbook', book)
        const bookToSave = { ...book, id: null }
        // console.log('bookToSave', bookToSave)
        bookService.save(bookToSave)
            .then(() => {
                showSuccessMsg('Google book added')
                navigate('/book')
            })
            .catch(err => console.error('Failed to save book:', err))
    }

    function handleAddGoogleBookById(bookId) {
        const book = books.find(book => book.id === bookId)
        if (!book) return console.error('Book not found:', bookId)

        onAddGoogleBook(book)
    }


    return (
        <section className="book-add">
            <h2>Add books from Google API</h2>

            <form onSubmit={onSearchGoogleAPI}>
                <input
                    type="text" name="text" placeholder="Search for a book"
                    value={searchTerm}
                    onChange={(ev) => {
                        const value = ev.target.value
                        setSearchTerm(value)
                        debouncedSearchTermRef.current(value)
                    }}
                />
                <button>Search</button>
            </form>
            {books.length ? <BookList books={books} onAddBook={handleAddGoogleBookById} />
                // <ul className="add-review">
                //     {books.map(book => (
                //         <li key={book.id}>
                //             {book.title}
                //             <button onClick={() => onAddGoogleBook(book)}>+</button>
                //         </li>
                //     ))}
                // </ul>
                : <p></p>

            }

        </section>
    )
}