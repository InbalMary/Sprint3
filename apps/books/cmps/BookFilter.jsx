import { bookService } from "../services/book.service.js"
import { debounce } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BookFilter({ defaultFilter, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })
    const onSetFilterByDebounce = useRef(debounce(onSetFilter, 500)).current

    useEffect(() => {
        // console.log('filterByToEdit', filterByToEdit)
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    const [categories, setCategories] = useState(null)
    useEffect(() => {
        loadCategories()
    }, [])

    function loadCategories() {
        bookService.getCategories().then(categories => {
            // console.log(categories);
            setCategories(categories)
        })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
            case 'text':
                value = target.value.trim()
                break
        }
        if (field === 'isOnSale') {
            if (value === 'all') value = null
            else value = (value === 'true')
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { title, authors, amount, isOnSale } = filterByToEdit

    return (
        <section className="book-filter container">
            <h2>Filter Our Books</h2>

            <form>
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
                    value={authors}
                    name="authors"
                    id="authors"
                    type="text"
                />
                <label htmlFor="categories">Categories</label>
                <select
                    onChange={handleChange}
                    defaultValue=""
                    name="categories"
                    id="categories"
                >
                    <option value="">Select Category</option>
                    {categories && categories.map(category =>
                        <option key={category} value={category}>{category}</option>
                    )}
                </select>
                <label htmlFor="amount">Max Price</label>
                <input
                    onChange={handleChange}
                    value={amount || ''}
                    name="amount"
                    id="amount"
                    type="number"
                />
                <label htmlFor="isOnSale">On Sale</label>
                <div id="isOnSale">
                    <label>
                        <input
                            type="radio"
                            name="isOnSale"
                            value="all"
                            checked={isOnSale === null}
                            onChange={handleChange}
                        />
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="isOnSale"
                            value="true"
                            checked={isOnSale === true}
                            onChange={handleChange}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="isOnSale"
                            value="false"
                            checked={isOnSale === false}
                            onChange={handleChange}
                        />
                        No
                    </label>
                </div>
            </form>
        </section>
    )
}
