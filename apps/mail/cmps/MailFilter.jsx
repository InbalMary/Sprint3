import { utilService } from "../../../services/util.service.js"

const { useState, useEffect, Fragment, useRef } = React

export function MailFilter({ defaultFilter, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })
    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilter, 500)).current

    useEffect(() => {
        // console.log('filterByToEdit', filterByToEdit)
        onSetFilterByDebounce(filterByToEdit)
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
            
        </Fragment>
    )
}
