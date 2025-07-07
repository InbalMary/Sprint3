const { useState, useEffect, Fragment } = React

export function MailFilter({ defaultFilter, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {

        const field = target.name
        let value = target.value

        if (value === 'true') value = true
        else if (value === 'false') value = false

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const toggleSort = (sortBy) => {
        let newSortDirection = 'asc';

        if (filterByToEdit.sortBy === sortBy) {
            newSortDirection = filterByToEdit.sortDirection === 'asc' ? 'desc' : 'asc';
        }

        const updatedFilter = {
            ...filterByToEdit,
            sortBy,
            sortDirection: newSortDirection
        }

        setFilterByToEdit(updatedFilter);
    }

    const clearAllFilters = () => {
        const clearedFilter = {
            txt: '',
            isRead: '',
            from: '',
            subject: '',
            sortBy: null,
            sortDirection: 'asc'
        }
        setFilterByToEdit(clearedFilter);
    }

    return (
        <Fragment>
            <div className="search-bar">
                <input
                    type="text"
                    name="txt"
                    placeholder="Search mail..."
                    value={filterByToEdit.txt || ''}
                    onChange={handleChange}
                />
                <span className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                </span>
            </div>
            <div className="more-filtration">
                <select name="isRead" id="read-select" onChange={handleChange}
                    value={filterByToEdit.isRead !== undefined ? filterByToEdit.isRead : ''}>
                    <option value="">All</option>
                    <option value="true">Read</option>
                    <option value="false">Unread</option>
                </select>

                <button
                    className={`sort-button ${filterByToEdit.sortBy === 'sentAt' ? `active ${filterByToEdit.sortDirection}` : ''}`}
                    onClick={() => toggleSort('sentAt')}
                >{filterByToEdit.sortBy === 'sentAt' ? (
                    filterByToEdit.sortDirection === 'asc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>) :
                        (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>)) : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>
                    }Date</button>

                <button
                    className={`sort-button ${filterByToEdit.sortBy === 'from' ? `active ${filterByToEdit.sortDirection}` : ''}`}
                    onClick={() => toggleSort('from')}
                >{filterByToEdit.sortBy === 'from' ? (
                    filterByToEdit.sortDirection === 'asc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>) :
                        (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>)) : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>
                    }From</button>

                <button
                    className={`sort-button ${filterByToEdit.sortBy === 'subject' ? `active ${filterByToEdit.sortDirection}` : ''}`}
                    onClick={() => toggleSort('subject')}
                >{filterByToEdit.sortBy === 'subject' ? (
                    filterByToEdit.sortDirection === 'asc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>) :
                        (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>)) : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>
                    }Subject</button>

                <button className="clear-filters" onClick={clearAllFilters}>
                    Clean all
                </button>
            </div>
        </Fragment>
    )
}
