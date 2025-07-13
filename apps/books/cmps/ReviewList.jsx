import { ReviewPreview } from "./ReviewPreview.jsx";

export function ReviewList({ reviews, onRemoveReview }) {
    return (
        <ol className="reviews-list">
            {reviews.map((rev, idx) => (
                <li key={idx} className="review-card">
                    <ReviewPreview rev={rev} />
                    <button onClick={() => onRemoveReview(rev.id)}>Delete 🗑️</button>
                </li>
            ))}
        </ol>
    )
}