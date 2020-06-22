import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import $ from 'jquery'


class Navbar extends React.Component {
    state = {
        tog: false
    }
    toggle = () => {
        console.log(this.state.tog)
        if (this.state.tog == false) {
            $(".nav").css("background-color", "#222")
            this.setState({
                tog: true
            })
        }
        else {
            if ($(document).scrollTop() > 70) {
                $(".nav").css("background-color", "transparent")
            }
            
            this.setState({
                tog: false
            })
        }
    }
    render() {
        document.addEventListener("scroll",  ()=> {
            if ($(document).scrollTop() > 70) {
                console.log(this.state.tog)
                if (this.state.tog == false) {
                    $(".nav").css("background-color", "transparent")
                }
                else{
                    $(".nav").css("background-color", "#222")
                }
                $(".logo").css("opacity", "0")
            }
            else {
                $(".nav").css("background-color", "#222")
                $(".logo").css("opacity", "1")
            }
        })
        return (
            <div className="ho">
                <nav className="nav">
                    <div className="container">
                        <ul className="menu">
                            <li className="logo"><Link to="/"><i className="far fa-question-circle"></i> Quizly </Link></li>
                            <li className="item" data-scroll="features"><a href="#" >Features</a></li>
                            <li className="item" data-scroll="review"><a href="#" >Review</a></li>
                            <li className="item" data-scroll="contact"><a href="#" >Contact</a></li>
                            <li className="item button"><Link to="/login">Log In</Link></li>
                            <li className="item button secondary"><Link to="/signup">Sign Up</Link></li>
                            <li className="toggle"><button onClick={() => this.toggle()}  ><i className="fas fa-bars"></i></button></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;