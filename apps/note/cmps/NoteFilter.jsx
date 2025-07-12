const { useState, useEffect } = React

export function NoteFilter({ defaultFilter, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        if (target.type === 'number') {
            value = +value
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { txt, type } = filterByToEdit

    return (
        <section className="note-filter-container">

            <form className="search-form">
                <svg xmlns="http://www.w3.org/2000/svg"
                    height="24px" viewBox="0 -960 960 960"
                    width="24px" fill="currentColor">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
                <input onChange={handleChange}
                    value={txt} name="txt"
                    id="txt" type="text"
                    className="note-input-filter"
                    placeholder="Search"
                    aria-label="Search"
                />
                <select
                    name="type"
                    value={type}
                    onChange={handleChange}
                    className="note-type-filter"
                >
                    <option value="all">All Types</option>
                    <option value="NoteTxt">Text</option>
                    <option value="NoteList">List</option>
                    <option value="NoteImg">Image</option>
                    <option value="NoteVideo">Video</option>
                </select>
            </form>

        </section>
    )
}