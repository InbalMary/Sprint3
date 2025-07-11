import { NoteFilter } from './NoteFilter.jsx'

export function NoteHeader({ children }) {
    return (
        <header className="note-header-container">
            <div className="header-content">
                <button className="menu-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                </button>
                <img src="/assets/icons/notes/logo.png" alt="NoteKeep logo" className="logo-img" />
                <h1 className="logo-text">Keep</h1>
                {children}
            </div>
        </header>
    )
}