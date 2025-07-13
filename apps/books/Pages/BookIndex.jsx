import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { getTruthyValues } from "../services/util.service.js"

const { Link, useSearchParams } = ReactRouterDOM
const { useState, useEffect } = React

export function BookIndex() {

    const [books, setBooks] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(bookService.getFilterFromSearchParams(searchParams))

    useEffect(() => {
        loadBooks()
        setSearchParams(getTruthyValues(filterBy))
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy)
            .then(setBooks)
            .catch(err => console.log('err:', err))
    }

    function onRemoveBook(bookId) {
        bookService.remove(bookId)
            .then(() => {
                showSuccessMsg('Book Removed Successfully!')
                setBooks((prevBooks) =>
                    prevBooks.filter(book => book.id !== bookId)
                )
            })
            .catch(err => {
                // console.log(err)
                showErrorMsg('Problem removing book')
            })
    }

    function onSetFilter(filterBy) {
        // console.log('filterBy', filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!books) return <div className="loader">Loading...</div>

    return (
        <section className="book-index">
            <BookFilter
                defaultFilter={filterBy}
                onSetFilter={onSetFilter}
            />
            <section className="btn-container">
                <Link className="btn" to="/book/edit">Add Book</Link>
                <Link className="btn" to="/book/add">Add Google Book</Link>
                <Link className="btn" to="/book/chart">Categories chart</Link>
            </section>

            <BookList
                books={books}
                onRemoveBook={onRemoveBook}
            />
        </section>
    )


}