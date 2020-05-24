import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bake_cookie } from 'sfcookies'
import InstructorHome from '../../InstructorComp/InstructorHome'
// import InstructorHome from '../../instructorComp/instructorHome'
import './style.css';
import './css/util.css';
import './vendor/animate/animate.css'
import './vendor/animsition/css/animsition.min.css'
import './vendor/select2/select2.min.css'
import './vendor/css-hamburgers/hamburgers.min.css'
import './vendor/daterangepicker/daterangepicker.css'
import axios from 'axios'



class Login extends Component {
    state = {
        url:""
    }
    componentDidMount = () => {
        axios.get('js/data.json').then(res => {
            this.setState({
                url:res.data.url
            })
        })
    }




    LoginAt = async (e) => {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Email": username,
                "Password": password
            })
        };

        let api;
        let {url} = this.state
        
        console.log("URL: " , url)
        try {
        api = await fetch('https://quizly-app.herokuapp.com/instructor/login', requestOptions)
        
            const data = await api.json();
            if (data.instructor) {
                bake_cookie('token', data.token);
                bake_cookie("instructorID", data.instructor._id);
                bake_cookie("instructorEmail", data.instructor.Email);
                bake_cookie("instructorFirstName", data.instructor.Frist_Name);
                bake_cookie("instructorLastName", data.instructor.Last_Name);
                bake_cookie("instructorAge", data.instructor.Age);
                bake_cookie("instructorAddress", data.instructor.Address);
                // const api2 = await fetch('https://quizly-app.herokuapp.com/instructor/'+data.instructor._id+'/pic').then(res => {
                //     bake_cookie('pic' , res)
                // })


                this.props.history.push("/instructorHome");
            }
            else {
                console.log("0")
            }
        }
        catch(e){
            console.log(e)
        }

    }


    render() {

        return (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={this.LoginAt}>

                            <div className="logo1"><Link to="/"><i className="far fa-question-circle"></i> Quizly </Link></div>
                            <span className="login100-form-title p-b-34">
                                Account Login
					        </span>

                            <div className="wrap-input100 rs1-wrap-input100 validate-input m-b-20" data-validate="Type user name">
                                <input id="first-name" className="input100" type="text" name="username" placeholder="User name" />
                                <span className="focus-input100"></span>
                            </div>
                            <div className="wrap-input100 rs2-wrap-input100 validate-input m-b-20" data-validate="Type password">
                                <input className="input100" type="password" name="password" placeholder="Password" />
                                <span className="focus-input100"></span>
                            </div>

                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn">
                                    Sign in
						        </button>
                            </div>

                            <div className="w-full text-center p-t-27 p-b-239">
                                <span className="txt1">
                                    Forgot
						        </span>

                                <a href="#" className="txt2">
                                    User name / password?
						        </a>
                            </div>

                            <div className="w-full text-center">
                                <Link to="/signup" className="txt3">
                                    Sign Up
						        </Link>
                            </div>
                        </form>

                        <div className="login100-more" ></div>
                    </div>
                </div>
            </div>



        )
    }
}

export default Login;