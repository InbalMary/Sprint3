import { animateCSS } from "../services/util.service.js"

const { Link, NavLink } = ReactRouterDOM
const { useRef } = React

export function AppHeader() {

    const elH1 = useRef(null)

    function handleLinkClick(ev) {
        // console.log('ev inside handel', ev)
        animateCSS(elH1.current, 'pulse')
    }

    return (
        <header className="app-header container">
            <section>
                <h1 ref={elH1}>Miss Books</h1>
                <nav className="app-nav">
                    <NavLink onClick={handleLinkClick} to="/home" >Home</NavLink>
                    <NavLink onClick={handleLinkClick} to="/about" >About</NavLink>
                    <NavLink onClick={handleLinkClick} to="/book" >Books</NavLink>
                </nav>
            </section>
        </header>
    )
}