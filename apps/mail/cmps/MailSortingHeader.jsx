

export function MailSortingHeader({ filterByToEdit, handleChange, toggleSort, clearAllFilters }) {
    return (
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
    )
}