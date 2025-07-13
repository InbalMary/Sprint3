import { bookService } from '../services/book.service.js'

const { useState } = React

export function AddReview({ bookId, onAddReview }) {
    const [review, setReview] = useState(bookService.getEmptyRev())
    const [cmpType, setCmpType] = useState('rateByStars')

    const [ratingStyle, setRatingStyle] = useState({
        rateBySelect: review.rating,
        rateByTextbox: review.rating,
        rateByStars: review.rating
    })

    function onSetRatingStyle(newStyle) {
        // console.log('newStyle', newStyle)
        const value = Object.values(newStyle)[0] //get only the val from whtever key
        setReview(prev => ({ ...prev, rating: value }))
        setRatingStyle(prevStyle => ({ ...prevStyle, ...newStyle }))
    }

    function handleChange({ target }) {
        const { name, value } = target
        setReview(prev => ({ ...prev, [name]: name === 'rating' ? +value : value }))
    }

    function onSubmitAddReview(ev) {
        ev.preventDefault()
        const reviewToAdd = { ...review }
        bookService.addReview(bookId, review)
            .then(() => {
                setReview(bookService.getEmptyRev())
                onAddReview(reviewToAdd)
            })
            .catch(err => {
                console.error('Failed to add review:', err)
            })
    }

    const { fullName, readAt, reviewText } = review
    return (
        <section className="add-review">
            <form onSubmit={onSubmitAddReview}>
                <label htmlFor="fullname">Full name: </label>
                <input required onChange={handleChange} value={fullName} type="text" name="fullName" id="fullname" />

                <section className='rating-container'>
                    <h5> Rating: </h5>
                    <fieldset>
                        <legend>Select rating style:</legend>
                        <div>
                            <input type="radio" id="rateBySelect" name="ratingStyle" value="rateBySelect"
                                checked={cmpType === 'rateBySelect'}
                                onChange={ev => setCmpType(ev.target.value)}
                            />
                            <label htmlFor="rateBySelect">Rate By Select</label>
                        </div>

                        <div>
                            <input type="radio" id="rateByTextbox" name="ratingStyle" value="rateByTextbox"
                                checked={cmpType === 'rateByTextbox'}
                                onChange={ev => setCmpType(ev.target.value)}
                            />
                            <label htmlFor="rateByTextbox">Rate By Textbox</label>
                        </div>

                        <div>
                            <input type="radio" id="rateByStars" name="ratingStyle" value="rateByStars"
                                checked={cmpType === 'rateByStars'}
                                onChange={ev => setCmpType(ev.target.value)}
                            />
                            <label htmlFor="rateByStars">Rate By Stars</label>
                        </div>
                    </fieldset>
                    <DynamicCmp {...ratingStyle} cmpType={cmpType} onSetRatingStyle={onSetRatingStyle} />
                </section>

                <label htmlFor="readAt">Read At: </label>
                <input type="date" id="readAt" name="readAt"
                    value={readAt} onChange={handleChange}
                />

                <label htmlFor="reviewText">Your Review: </label>
                <textarea id="reviewText" name="reviewText"
                    value={reviewText || ''} onChange={handleChange}
                    placeholder="Share your review here...)"
                    rows="4"
                />

                <button>Save</button>
            </form>

        </section>
    )
}


function DynamicCmp(props) {
    const dynamicCmpsMap = {
        rateBySelect: <RateBySelect {...props} />,
        rateByTextbox: <RateByTextbox {...props} />,
        rateByStars: <RateByStars {...props} />
    }
    return dynamicCmpsMap[props.cmpType]
}

//** Demo Cmps **/
function RateBySelect({ onSetRatingStyle, rateBySelect }) {
    console.log('rateBySelect', rateBySelect)
    function onSetRating(ev) {
        const newRating = { rateBySelect: +ev.target.value }
        onSetRatingStyle(newRating)
    }
    return (
        <select value={rateBySelect} onChange={onSetRating}>
            {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                    {num}
                </option>
            ))}
        </select>
    )
}

function RateByTextbox({ onSetRatingStyle, rateByTextbox }) {
    function onSetRating(ev) {
        const newRating = { rateByTextbox: +ev.target.value }
        onSetRatingStyle(newRating)
    }
    return (
        <input className='txt-rating-input' type='number' min={1} max={5} 
        placeholder={'Enter rating (1-5)'} onChange={onSetRating}></input>
    )
}

function RateByStars({ onSetRatingStyle, rateByByStars }) {
    function onSetRating(val) {
        const newRating = { rateByByStars: val }
        onSetRatingStyle(newRating)
    }

    return (
        <section className="stars-ratings">
            <div className="stars">
                {[1, 2, 3, 4, 5].map(val => (
                    <span
                        key={val}
                        className={`star ${val <= rateByByStars ? 'active' : ''}`}
                        onClick={() => onSetRating(val)}
                    >⭐</span>
                ))}
            </div>
        </section>
    )
}