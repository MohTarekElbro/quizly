import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { bake_cookie } from 'sfcookies'
import AdminHome from '../AdminHome'
import { DualRing } from 'react-spinners-css';
import $ from 'jquery'




class AdminLogin extends Component {


    componentDidMount = async () => {
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
                if (data.type == "admin") {
                    this.props.history.push("/adminHome")
                }

            }
            catch (e) {
                console.log("Error: ", e);
            }
        }
    }

    LoginAt = async (e) => {
        $("*").css("cursor", "progress")
        $(".newLoading").css("display", "flex")
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        console.log(username, password)
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
        console.log(api.status)
        if (api.status == 404) {
            $("*").css("cursor", "default")
            $(".newLoading").css("display", "none")

            $.alert({
                title: 'Failed!',
                boxWidth: '400px',
                useBootstrap: false,
                content: "Wrong email or password",
                buttons: {
                    okay: function () { },
                }
            });
        }
        if (data.admin) {
            $("*").css("cursor", "default")
            $(".newLoading").css("display", "none")
            localStorage.setItem('token', data.token);
            localStorage.setItem("adminID", data.admin._id);
            localStorage.setItem("adminEmail", data.admin.email);

            const api2 = await fetch('https://quizly-app.herokuapp.com/admin/' + data.admin._id + '/pic').then(res => {
                localStorage.setItem('pic', res)
            })


            this.props.history.push("/adminHome");
        }
        else {
            $("*").css("cursor", "default")
            $(".newLoading").css("display", "none")

            $.alert({
                title: 'Failed!',
                boxWidth: '400px',
                useBootstrap: false,
                content: "Wrong email or password",
                buttons: {
                    okay: function () { },
                }
            });
        }

    }


    render() {

        return (
            <Fragment>
                <div className="newLoading">
                    <DualRing color="red" />
                </div>
                <div class="container">

                    <div class="row justify-content-center">

                        <div class="col-xl-10 col-lg-12 col-md-9">

                            <div class="card o-hidden border-0 shadow-lg my-5">
                                <div class="card-body p-0">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="p-5">
                                                <div class="text-center">
                                                    <h1 class="h4 text-gray-900 mb-4">Welcome Admin!</h1>
                                                </div>
                                                <form onSubmit={this.LoginAt} class="user">
                                                    <div class="form-group">
                                                        <input type="email" name="username" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="password" name="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                    </div>

                                                    <input type="submit" value="Login" class="btn btn-primary btn-user btn-block" />



                                                </form>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </Fragment>
        )
    }
}

export default AdminLogin;