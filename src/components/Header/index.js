import React from 'react'
import './style.css'

const Header = () => {
    
    return (
        <header>
            <div className="container">
                <div className="discription">
                    <i className="far fa-question-circle cat"></i>
                    <p className = "websiteTitle">intelligent Hard Question Generator</p>
                    <div className="line"></div>
                    <p className = "websitediscrip"> If you are looking for eazy way to generate multiple levels of questions in a short time, you are in the right place </p>
                    <div className="downloadButton">Open App</div>
                </div>
                <div className="lab-img"></div>
            </div>
        </header>
    )
}

export default Header;