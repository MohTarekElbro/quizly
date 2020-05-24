import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Navbar = () => {
    return (
        <div className = "ho">
            <nav className = "nav">
                <div className="container">
                    <ul className="menu">
                        <li className="logo"><Link to="/"><i className="far fa-question-circle"></i> Quizly </Link></li>
                        <li className="item" data-scroll="features"><a href="#" >Features</a></li>
                        <li className="item" data-scroll="review"><a href="#" >Review</a></li>
                        <li className="item" data-scroll="contact"><a href="#" >Contact</a></li>
                        <li className="item button"><Link to="/login">Log In</Link></li>
                        <li className="item button secondary"><Link to="/signup">Sign Up</Link></li>
                        <li className="toggle"><a><i className="fas fa-bars"></i></a></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;