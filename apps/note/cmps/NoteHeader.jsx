
export function NoteHeader({ children, clickedBtn }) {
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
                <button className="menu-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                {/* Only show logo image on Keep */}
                {clickedBtn === 'bulb' && (
                    <img src={`${process.env.PUBLIC_URL}/assets/icons/notes/logo.png`} alt="NoteKeep logo" className="logo-img" />
                )}

                <h1 className="logo-text">{getTitle()}</h1>
                {children}
            </div>
        </header>
    )
}