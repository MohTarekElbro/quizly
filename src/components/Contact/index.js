import React from 'react'
import './style.css'

const Contact = () => {
    return (
        <div className="contact block" id="contact">
            <div className="container">
                <h1>Contact Us</h1>
                <div className="line"></div>
                <p>iam looking to work in adam company because i want to have some experiance</p>
                <form action="" className="contactform">
                    <input className="name" name="name" placeholder="name" type="text" />
                    <input className="email" name="email" placeholder="email" type="text" />
                    <input className="subject" name="subject" placeholder="subject" type="text" />
                    <textarea placeholder="Message" className="message" maxLength="1000"></textarea>
                </form>

                <div className="downloadButton">Send Message</div>
            </div>
        </div>
    )
}

export default Contact;