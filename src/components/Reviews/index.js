import React, { Component } from 'react'
import axios from 'axios'
import './style.css'

class Reviews extends Component {

    state = {
        reviews: []

    }

    componentDidMount = () => {
        axios.get('js/data.json').then(res => { this.setState({ reviews: res.data.reviews }) })
    }

    render() {

        const { reviews } = this.state;

        const reviewsList = reviews.map((review) => {
            return (

                <div key = {review.id} className="review">
                    <p>{review.message} </p>
                    <div className="userdata">
                        <img src="images/post.png" alt="" />
                        <div>
                            <h2>{review.name}</h2>
                            <p>{review.job}</p>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <div className="startreviews block" id="review">
                <div className="container">
                    <h1 >What our customers are saying</h1>
                    <div className="line"></div>
                    {/* <p>iam looking to work in adam company because i want to have some experiance</p> */}
                    <div className="reviews">
                        {reviewsList}
                    </div>
                </div>
            </div>
        )
    }
}

export default Reviews;