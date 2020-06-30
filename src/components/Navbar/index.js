import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import $ from 'jquery'
import { withRouter } from "react-router-dom";


class Navbar extends React.Component {
    state = {
        tog: false
    }
    // toggle = () => {
    //     console.log("this.state.tog")
    //     if (this.state.tog == false) {
    //         $(".nav").css("background-color", "#222")
    //         this.setState({
    //             tog: true
    //         })
    //     }
    //     else {
    //         if ($(document).scrollTop() > 70) {
    //             $(".nav").css("background-color", "transparent")
    //         }
    //         this.setState({
    //             tog: false
    //         })
    //     }
    // }

    componentDidMount = async () => {
        // $(".nav").css("top", "50px")
        $(".toggle").on("click", function () {

            if ($(".item").hasClass("active")) {
                console.log("MOMOMO")
                $(".item").removeClass("active");
                $(this).find("span").html("<i class='fas fa-bars'></i>");
                if ($(document).scrollTop() > 70) {
                    console.log("MOMOMO2")
                    $(".nav").css("background-color", "transparent")
                    // $(".nav").css("top", "30px")
                }
            } else {
                console.log("else")
                $(".nav").css("background-color", "#222")
                $(".item").addClass("active");
                $(this).find("span").html("<i class='fas fa-times'></i>");
            }

            // $(".nav").css("background-color", "#222")
        });

        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWVjOGM3MjhiNTc1NTNjZGM1NDQxODUiLCJpYXQiOjE1OTMzNDczMDF9.V6Ffh7j9nZJEkXgc7TVn44eKtPgfR-KF4rwy9hfrOdE
        if (localStorage.getItem("token")) {
            window.addEventListener('scroll', this.handleScroll);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "token": localStorage.getItem("token")
                })
            };
            let api;
            try {
                api = await fetch('https://quizly-app.herokuapp.com/check', requestOptions)
                const data = await api.json();
                if (data.type == "instructor") {
                    this.props.history.push("/instructorHome/generateExam")
                }
                else if(data.type == "admin") {
                    this.props.history.push("/adminHome")
                }

            }
            catch (e) {
                console.log("Error: ", e);
            }
        }
    }
    render() {
        let tog = this.state.tog

        document.addEventListener("scroll", () => {
            $(".nav").css("top", "0px")

            if ($(document).scrollTop() > 70 && $(window).width() < 770) {
                // console.log(this.state.tog)
                if (this.state.tog == false) {
                    $(".nav").css("background-color", "transparent")
                    $(".nav").css("top", "20px")
                }
                else {
                    $(".nav").css("background-color", "#222")
                }
                $(".logo").css("display", "none")
            }
            else {
                $(".nav").css("background-color", "#222")
                $(".logo").css("display", "block")
            }
        })
        return (
            <div className="ho">
                <nav className="nav">
                    <div className="container">
                        <ul className="menu">
                            <Link className="ooo" to="/instructorHome" style={{ "display": "none" }}></Link>
                            <li className="logo"><Link to="/"><i className="far fa-question-circle"></i> Quizly </Link></li>
                            <li className="item" data-scroll="features"><a href="#" >Features</a></li>
                            <li className="item" data-scroll="review"><a href="#" >Review</a></li>
                            <li className="item" data-scroll="contact"><a href="#" >Contact</a></li>
                            <li className="item button"><Link to="/login">Log In</Link></li>
                            <li className="item button secondary"><Link to="/signup">Sign Up</Link></li>
                            <li className="toggle"><span ><i className="fas fa-bars"></i></span></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Navbar);