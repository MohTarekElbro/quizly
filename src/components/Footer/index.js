import React from 'react'
import './style.css'

const Footer = () => {
    return (
        <footer className = "footer">
            <div className="container">
                <p><i className="far fa-copyright"></i> 2020 Quizly, All Rights Reserved.</p>
                <ul>
                    <li><i className="fab fa-facebook-f"></i></li>
                    <li><i className="fab fa-twitter"></i></li>
                    <li><i className="fab fa-google-plus-g"></i></li>
                    <li><i className="fab fa-pinterest"></i></li>
                    <li><i className="fab fa-instagram-square"></i></li>
                    <li><i className="fab fa-stumbleupon"></i></li>
                    <li><i className="fas fa-wifi"></i></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;