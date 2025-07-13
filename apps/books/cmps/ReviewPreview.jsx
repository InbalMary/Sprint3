const { Fragment } = React

export function ReviewPreview({ rev }) {
    return (
        <Fragment >
            <section>
                <h5> Full name: </h5>
                <p>{rev.fullName}</p>
            </section>
            <section>
                <h5> Rating: </h5>
                <p>{'⭐'.repeat(rev.rating)}</p>
            </section>
            <section>
                <h5> Read At: </h5>
                <p>{rev.readAt}</p>
            </section>
            <section>
                <h5> Review Text: </h5>
                <p>{rev.reviewText}</p>
            </section>
        </Fragment>)
}