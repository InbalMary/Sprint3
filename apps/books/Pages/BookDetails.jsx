import { bookService } from "../services/book.service.js"
import { ReviewList } from "../cmps/ReviewList.jsx"
import { LongTxt } from "../cmps/LongTxt.jsx"
import { AddReview } from "../cmps/AddReview.jsx"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useParams, useNavigate, Link } = ReactRouterDOM
const { useState, useEffect } = React

export function BookDetails() {

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    // const [reviews, setReviews] = useState(null)
    const params = useParams()
    const navigate = useNavigate()
    // TODO: reviews inside state

    const [isAddingReview, setIsAddingReview] = useState(false)

    useEffect(() => {
        loadBook()
    }, [params.bookId])

    function loadBook() {
        setIsLoading(true)
        bookService.get(params.bookId)
            .then(book => {
                setBook(book)
                // setReviews(book.reviews || [])
            })
            .catch(err => {
                // console.log('err:', err)
            })
            .finally(() => setIsLoading(false))
    }

    function getPageCountInfo(pageCount) {
        if (pageCount > 500) return 'Serious Reading'
        if (pageCount > 200) return ' Descent Reading'
        return 'Light Reading'
    }

    function getDateCategory(publishedDate) {
        const curYear = (new Date()).getFullYear()
        if (curYear - publishedDate > 10) return 'Vintage'
        return 'New'
    }

    function getAmountClass(amount) {
        if (amount > 150) return 'red'
        if (amount < 20) return 'green'
        return ''
    }

    function onBack() {
        navigate('/book')
    }

    function onSetIsEditMode() {
        setIsAddingReview(prev => !prev)
    }

    function onRemoveReview(reviewId) {
        bookService.removeReview(book.id, reviewId)
            .then((updatedBook) => {
                showSuccessMsg('Review removed succssefuly')
                setBook(updatedBook)
                // loadBook() // TODO: update reviews (setReviews)
                // setReviews(prevReviews => prevReviews.filter(rev => rev.id !== reviewId))
            })
            .catch(err => {
                console.error('Failed to remove review:', err)
                showErrorMsg('Failed to remove review')
            })
    }

    function onAddReview(newReview) {
        // setReviews(prevReviews => [newReview, ...prevReviews])
        setBook(book => ({
            ...book,
            reviews: [newReview, ...(book.reviews || [])]
        }))
        setIsAddingReview(false)
    }

    if (isLoading) return <div className="loader">Loading...</div>
    const { title, subtitle, authors, publishedDate, description, pageCount, categories, thumbnail, language, listPrice } = book
    const { amount, isOnSale } = listPrice

    const pageCountInfo = getPageCountInfo(pageCount)
    const dateCategory = getDateCategory(publishedDate)
    const amountClass = getAmountClass(amount)

    return (
        <section className="book-details container">
            <img src={thumbnail} alt={title} />
            <h1 className="book-title">{title}</h1>
            <h2 className="book-subtitle">{subtitle}</h2>
            <section className="book-authors">
                <h4>Authors</h4>
                <ul>
                    {authors.map(author => <li key={author}>{author}</li>)}
                </ul>
            </section>
            <section className="book-published-date">
                <h4>Published Date:</h4>
                <p>{publishedDate} - {dateCategory}</p>
            </section>
            <LongTxt txt={description} length={20} />
            <section className="book-page-count">
                <h4>Page Count:</h4>
                <p>{pageCount} - {pageCountInfo}</p>
            </section>
            <section className="book-categories">
                <h4>Categories</h4>
                <ul>
                    {categories.map(cat => <li key={cat}>{cat}</li>)}
                </ul>
            </section>
            <section className="book-language">
                <h4>Language:</h4>
                <p>{language}</p>
            </section>
            <section>
                <h4>Price:</h4>
                <p><span className={`book-price ${amountClass}`}>{amount}</span></p>
            </section>
            <section className="book-on-sale">
                <h4>On Sale:</h4>
                <p>{isOnSale ? 'Yes' : 'No'}</p>
            </section>

            <section className="reviews-section">
                <h4>Reveiws: </h4>
                {!book.reviews && (<p>No reviews yet</p>)}
                {book.reviews && <ReviewList reviews={book.reviews} onRemoveReview={onRemoveReview} />
                }

                {isAddingReview && (
                    <section className="add-review-box">
                        <AddReview bookId={book.id} onAddReview={onAddReview} />
                    </section>
                )}

                <button className="btns-rev" onClick={onSetIsEditMode}>
                    {isAddingReview ? 'Cancel' : 'Add Review'}
                </button>
            </section>
            {isOnSale ? <span className="on-sale-badge">On Sale</span> : ''}
            <button className="btns-rev" onClick={onBack}>Back</button>
            <section>
                <button ><Link to={`/book/${book.prevBookId}`}>Prev Book</Link></button>
                <button ><Link to={`/book/${book.nextBookId}`}>Next Book</Link></button>
            </section>
        </section>
    )
}