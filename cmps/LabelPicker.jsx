const { useState } = React

export function LabelPicker({ selectedLabels, onUpdateLabels }) {
    const categories = [
        { cat: 'Critical', color: '#F9C5BD' },
        { cat: 'Family', color: '#C5D6F3' },
        { cat: 'Work', color: '#B39DDB' },
        { cat: 'Friends', color: '#4285F4' },
        { cat: 'Spam', color: '#00ACC1' },
        { cat: 'Memories', color: '#F48FB1' },
        { cat: 'Romantic', color: '#dcdc8c' }
    ]

    // const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)

    const toggleCategory = (catName, ev) => {
        ev.stopPropagation()
        const isSelected = onCheckIfSelected(catName)
        onUpdateLabels(catName, isSelected ? 'remove' : 'add')
    }

    function onLabelPickerClick(ev) {
        ev.stopPropagation()
        setOpen((prev) => !prev)
    }

    function onCheckIfSelected(catName) {
        return selectedLabels.includes(catName)
    }

    return (
        <div className="label-picker-container">
            <button title="Label as"  className="label-picker-button" onClick={(ev) => onLabelPickerClick(ev)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="12px" fill="#1f1f1f"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l216 288-216 288q-11 15-28 23.5t-36 8.5H160Zm0-80h440l180-240-180-240H160v480Zm220-240Z" /></svg>
                {open ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="12px" fill="#1f1f1f"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="12px" fill="#1f1f1f"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>}
            </button>
            {open && (
                <div className="label-picker-dropdown">
                    {categories.map((category) => (
                        <label key={category.cat} className="label-picker-option" onClick={(ev) => ev.stopPropagation()}
                            style={{ backgroundColor: category.color, color: 'white' }}>
                            <input
                                type="checkbox"
                                checked={onCheckIfSelected(category.cat)}
                                onChange={(ev) => toggleCategory(category.cat, ev)}
                            />
                            <span className="cat-name" >
                                {category.cat}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>


    )
}