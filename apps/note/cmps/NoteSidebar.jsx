
const { useState } = React

export function NoteSidebar({ clickedBtn, setClickedBtn, isSidebarOpen }) {
    const [isHovered, setIsHovered] = useState(false)
    const isExpanded = isSidebarOpen || isHovered

    const handleClick = (btnName) => {
        if (clickedBtn === btnName) {
            setClickedBtn('bulb')
        } else {
            setClickedBtn(btnName)
        }
    }

    return (
        <nav
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ul>
                <li>
                    <button
                        className={`notes-bulb btn ${clickedBtn === 'bulb' ? 'selected' : ''}`}
                        onClick={() => handleClick('bulb')}
                        title="Main menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M400-240q-33 0-56.5-23.5T320-320v-50q-57-39-88.5-100T200-600q0-117 81.5-198.5T480-880q117 0 198.5 81.5T760-600q0 69-31.5 129.5T640-370v50q0 33-23.5 56.5T560-240H400Zm0-80h160v-92l34-24q41-28 63.5-71.5T680-600q0-83-58.5-141.5T480-800q-83 0-141.5 58.5T280-600q0 49 22.5 92.5T366-436l34 24v92Zm0 240q-17 0-28.5-11.5T360-120v-40h240v40q0 17-11.5 28.5T560-80H400Zm80-520Z" />
                        </svg>
                        {isExpanded && <span>Notes</span>}
                    </button>
                </li>
                <li>
                    <button
                        className={`archive-note btn ${clickedBtn === 'archive' ? 'selected' : ''}`}
                        onClick={() => handleClick('archive')}
                        title="Archive">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />
                        </svg>
                        {isExpanded && <span>Archive</span>}
                    </button>
                </li>
                <li>
                    <button
                        className={`trash btn ${clickedBtn === 'bin' ? 'selected' : ''}`}
                        onClick={() => handleClick('bin')}
                        title="Delete note">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            height="24px" viewBox="0 -960 960 960"
                            width="24px" fill="currentColor">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                        {isExpanded && <span>Bin</span>}
                    </button>
                </li>
            </ul>
        </nav>
    );
}




