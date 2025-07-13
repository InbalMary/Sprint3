import { bookService } from "../services/book.service.js"

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function BookChart() {
    const [books, setBooks] = useState(null)
    const [categoryCounts, setCategoryCounts] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadBooks()
    }, [])

    function loadBooks() {
        bookService.query(bookService.getDefaultFilter())
            .then((books) => {
                setBooks(books)
                const counts = getCategoryCounts(books)
                console.log('counts map', counts)
                setCategoryCounts(counts)
            })
            .catch(err => console.log('err:', err))
    }

    function getCategoryCounts(books) {
        const categoryCounts = {}

        books.forEach(book => {
            if (!book.categories) return

            book.categories.forEach(category => {
                if (categoryCounts[category]) {
                    categoryCounts[category]++
                } else {
                    categoryCounts[category] = 1
                }
            })
        })
        return categoryCounts
    }

    function onBack() {
        navigate('/book')
    }

    if (!books || !categoryCounts) {
        return <div className="loader">Loading...</div>
    }

    const totalCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
    // console.log('totalCount:', totalCount)
    // console.log('categoryCounts:', categoryCounts)

    return (
        <section className="chart-container">
            <h2>Books categories chart:</h2>
            <div className="bars">
                {Object.entries(categoryCounts).map(([category, count]) => {
                    const percent = totalCount ? (count / totalCount) * 100 : 0
                    const height = `${percent}%`
                    return (
                        <div key={category} className="bar">
                            <div
                                className="bar-inner"
                                style={{ height }}
                                title={`${category}: ${count} books`}
                            >
                                <span className="bar-percent">{percent.toFixed(1)}%</span>
                            </div>
                            <span className="bar-label">{category}</span>
                        </div>
                    )
                })}
            </div>
            <button className="btns-rev" onClick={onBack}>Back</button>
        </section>
    )

}