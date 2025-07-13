export function BookPreview({ book }) {

    const { title, authors, categories, thumbnail, listPrice } = book
    const { amount, currencyCode, isOnSale } = listPrice
    return (
        <article className="book-preview">
            <img src={thumbnail} alt={title} />
            <h1 className="book-title">{title}</h1>
            <p className="book-authors">Authors: {authors.join(', ')}</p>
            
            <p className="book-categories">Categories: {categories.join(', ')}</p>
            <p className="book-price">Price: {amount} {currencyCode}</p>
            <p className="book-on-sale">On Sale: {isOnSale ? 'Yes' : 'No'}</p>
        </article>
    )
}