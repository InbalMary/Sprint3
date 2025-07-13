import { BookPreview } from "./BookPreview.jsx";

const { Link, useLocation } = ReactRouterDOM

export function BookList({ books, onRemoveBook, onAddBook }) {

    const location = useLocation()

    return (
        <ul className="book-list container">
            {books.map(book =>
                <li key={book.id}>
                    <BookPreview book={book} />
                    {!location.pathname.includes('add') ?
                        <section className="btns">
                            <button onClick={() => onRemoveBook(book.id)}>
                                Remove
                            </button>
                            <Link to={`/book/${book.id}`}>
                                <button>Details</button>
                            </Link>
                            <Link to={`/book/edit/${book.id}`}>
                                <button>Edit</button>
                            </Link>
                        </section> :
                        <section>
                            <button onClick={() => onAddBook(book.id)}>Add book</button>
                        </section>
                    }
                </li>
            )}
        </ul>
    )

}