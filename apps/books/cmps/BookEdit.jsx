import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function BookEdit() {
    const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
    const navigate = useNavigate()
    const { bookId } = useParams()

    useEffect(() => {
        if (bookId) loadBook()
    }, [])

    function loadBook() {
        bookService.get(bookId)
            .then(book => {
                const emptyBook = bookService.getEmptyBook()
                const fullBook = { ...emptyBook, ...book }

                fullBook.listPrice = {
                    ...emptyBook.listPrice,
                    ...book.listPrice
                }
                setBookToEdit(fullBook)
            })
            .catch(err => {
                console.error('Failed to load book:', err)
            })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
        }

        setBookToEdit(prev => {
            const updated = { ...prev }

            if (field === 'amount' || field === 'isOnSale') {
                updated.listPrice = {
                    ...updated.listPrice,
                    [field]: value
                }
            } else if (field === 'authors') {
                updated.authors = value.split(',').map(str => str.trim())
            } else if (field === 'categories') {
                updated.categories = [value]
            } else {
                updated[field] = value
            }

            return updated
        })
    }

    function onSaveBook(ev) {
        ev.preventDefault()
        const emptyBook = bookService.getEmptyBook()

        const fullBook = {
            ...emptyBook,
            ...bookToEdit,
            listPrice: {
                ...emptyBook.listPrice,
                ...bookToEdit.listPrice
            }
        }

        bookService.save(fullBook)
            .then((savedBook) => {
                showSuccessMsg(`Book Saved (id: ${savedBook.id})`)
                navigate('/book')
            })
            .catch(err => {
                console.log('Cannot save book:', err)
                showErrorMsg('Cannot save book')
            })
    }

    function onCanceled() {
        navigate('/book')
    }

    if (!bookToEdit) return <div className="loader">Loading...</div>

    const { title, authors = '', categories = '', listPrice = {} } = bookToEdit
    const { amount = '' } = listPrice

    return (
        <section className="book-edit container">
            <h1>{bookId ? 'Edit' : 'Add'} Book</h1>

            <form onSubmit={onSaveBook}>
                <label htmlFor="title">Title</label>
                <input
                    onChange={handleChange}
                    value={title}
                    name="title"
                    id="title"
                    type="text"
                />

                <label htmlFor="authors">Authors</label>
                <input
                    onChange={handleChange}
                    value={Array.isArray(authors) ? authors.join(', ') : authors}
                    name="authors"
                    id="authors"
                    type="text"
                />

                <label htmlFor="categories">Categories</label>
                <select
                    onChange={handleChange}
                    value={Array.isArray(categories) ? categories[0] || '' : categories}
                    name="categories"
                    id="categories"
                >
                    <option value="">Select Category</option>
                    <option value="Love">Love</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Computers">Computers</option>
                    <option value="Religion">Religion</option>
                </select>

                <label htmlFor="amount">Price</label>
                <input
                    onChange={handleChange}
                    value={amount}
                    name="amount"
                    id="amount"
                    type="number"
                />
                <div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onCanceled}>Cancel</button>
                </div>
            </form>
        </section>
    )
}
