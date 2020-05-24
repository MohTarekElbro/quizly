import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bake_cookie } from 'sfcookies'
import AdminHome from '../AdminHome'




class AdminLogin extends Component {




    LoginAt = async (e) => {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        console.log(username , password)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": username,
                "password": password
            })
        };

        const api = await fetch('https://quizly-app.herokuapp.com/Login', requestOptions)
        const data = await api.json();
        if (data.admin) {
            bake_cookie('token', data.token);
            bake_cookie("adminID", data.admin._id);
            bake_cookie("adminEmail", data.admin.email);
            
            const api2 = await fetch('https://quizly-app.herokuapp.com/admin/' + data.admin._id + '/pic').then(res => {
                bake_cookie('pic', res)
            })


            this.props.history.push("/adminHome");
        }
        else {
            console.log("0")
        }

    }


    render() {

        return (
            <div class="container">

                <div class="row justify-content-center">

                    <div class="col-xl-10 col-lg-12 col-md-9">

                        <div class="card o-hidden border-0 shadow-lg my-5">
                            <div class="card-body p-0">
                                <div class="row">
                                    <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div class="col-lg-6">
                                        <div class="p-5">
                                            <div class="text-center">
                                                <h1 class="h4 text-gray-900 mb-4">Welcome Admin!</h1>
                                            </div>
                                            <form onSubmit={this.LoginAt} class="user">
                                                <div class="form-group">
                                                    <input type="email" name = "username" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                </div>
                                                <div class="form-group">
                                                    <div class="custom-control custom-checkbox small">
                                                        <input type="checkbox" class="custom-control-input" id="customCheck" />
                                                        <label class="custom-control-label" for="customCheck">Remember Me</label>
                                                    </div>
                                                </div>
                                                <input type="submit" value = "Login" class="btn btn-primary btn-user btn-block"/>
                                                    
                                                
                                                <hr />
                                                <a href="#" class="btn btn-google btn-user btn-block">
                                                    <i class="fab fa-google fa-fw"></i> Login with Google
                                                </a>
                                                <a href="#" class="btn btn-facebook btn-user btn-block">
                                                    <i class="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                                </a>
                                            </form>
                                            
                                            <div class="text-center">
                                                <a class="small" href="forgot-password.html">Forgot Password?</a>
                                            </div>
                                            <div class="text-center">
                                                <a class="small" href="register.html">Create an Account!</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}

export default AdminLogin;