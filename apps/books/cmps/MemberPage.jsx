const { useParams } = ReactRouterDOM

export function MemberPage() {

    const params = useParams()
    // console.log('params', params)
    return (
        <section className="member-page">
            <h1>Member page</h1>
            <h2>Member Name: {params.memberName}</h2>

        </section>
    )
}