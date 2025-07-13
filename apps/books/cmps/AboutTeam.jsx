const { Outlet, Link } = ReactRouterDOM

export function AboutTeam() {
    return (
        <section>
            <h2>Best Team!</h2>
            <ul>
                <li>
                    <Link to={`Popo Decaprio`}>Popo Decaprio</Link>
                </li>
                <li>
                    <Link to={`Jini Baba`}>Jini Baba</Link>
                </li>
            </ul>
            <section>
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
            </section>

            <Outlet /> 
        </section>
    )
}