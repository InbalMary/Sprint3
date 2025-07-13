
export function NoteHeader({ children, clickedBtn, onToggleMenu }) {
    function getTitle() {
        switch (clickedBtn) {
            case 'bin':
                return 'Bin'
            case 'archive':
                return 'Archive'
            default:
                return 'Keep'
        }
    }
    return (
        <header className="note-header-container">
            <div className="header-content">
                <button className="menu-btn" onClick={onToggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {/* Only show logo image on Keep */}
                {clickedBtn === 'bulb' && (
                    <svg
                        className="logo-img" style={{ width: '44px', height: '40px' }} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370.86 509.93">
                        <title>google-keep</title>
                        <path className="cls-1" d="M336.09,509.93H34.77A34.72,34.72,0,0,1,0,475.16V34.77A34.72,34.72,0,0,1,34.77,0H243.38L370.86,127.48V475.16A34.72,34.72,0,0,1,336.09,509.93Z" />
                        <path className="cls-2" d="M243.38,0,370.86,127.48H243.38Z" />
                        <path className="cls-3" d="M226,341.88H144.87v29H226Z" />
                        <path className="cls-3" d="M185.43,173.84a75.31,75.31,0,0,0-40.1,139.07h80a75.31,75.31,0,0,0-40.1-139.07Z" />
                    </svg>

                )}

                <h1 className="logo-text">{getTitle()}</h1>
                {children}
            </div>
        </header>
    )
}