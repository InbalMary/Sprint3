export function ColorInput({ onSetNoteStyle }) { //pass the update function from the parent
    const colors = [
        '#ffffff',
        '#faafa8',
        '#f39f76',
        '#fff8b8',
        '#e2f6d3',
        '#b4ddd3',
        '#aeccdc',
        '#d3bfdb',
        '#f6e2dd',
        '#e9e3d4',
        '#efeff1',

    ]

    function onSetColor(color) {
        console.log('color:', color);
        onSetNoteStyle({ backgroundColor: color })
    }

    return (
        <section className="color-input"
            onClick={ev => ev.stopPropagation()}>
            <div className="colors-container">
                {colors.map(color => (
                    <div
                        key={color}
                        className="shade"
                        style={{ backgroundColor: color }}
                        onClick={() => onSetColor(color)}
                    ></div>
                ))}
            </div>
        </section>
    )
}