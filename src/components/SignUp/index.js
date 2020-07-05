import React, { Component } from 'react'
import './style.css'
import $ from 'jquery'
import socketIOClient from "socket.io-client";
import { read_cookie } from 'sfcookies'
import { DualRing } from 'react-spinners-css';

class SignUp extends Component {
    state = {
        firstName: "firstname",
        lastName: "lastname",
        email: "fdsfds@maail.com",
        age: "50",
        address: "address",
        img: "",
    }

    componentDidMount = () => {
        $(".newLoading").css("display", "none")
    }

    submit = async (e) => {
        $(".newLoading").css("display", "flex")
        const socket = socketIOClient("https://quizly-app.herokuapp.com")
        e.preventDefault()
        let file = this.cardPic.files[0]
        let formData = new FormData()
        formData.append('idPic', file)
        formData.append('Frist_Name', this.state.firstName)
        formData.append('Last_Name', this.state.lastName)
        formData.append('Email', this.state.email)
        formData.append('Address', this.state.address)
        formData.append('Age', this.state.age)

        const requestOptions = {
            method: 'POST',
            body: formData
        };
        let api;

        try {

            api = await fetch('https://quizly-app.herokuapp.com/instructor/signup', requestOptions)
            console.log(api.status)
            if (api.status == 200) {
                $.alert({
                    title: 'Success!',
                    content: 'Your request has been sent to the supervisor, wait for the response on your email',
                    buttons: {
                        okay: function () { $(".newLoading").css("display", "none") },

                    }
                });
            }
            else {
                $(".newLoading").css("display", "none")
            }



        }
        catch (e) {
            // const data = await api.json();
            console.log("ERROR: ", e)
            $(".newLoading").css("display", "none")
            // console.log(data)  
            // if(api.status == 200){
            //     socket.emit('AddRequest')
            // }

        }


    }

    uploadImage = (e) => {
        let input = this.cardPic
        console.log(input.files[0])
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#cardPic')
                    .css("display", "block")
                    .css("margin", "0 auto")
                    .attr('src', e.target.result)
                    .width(250)
                    .height(200);
                $('.saveImg').css('display', 'block')
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    resetAll = () => {
        // this.setState({
        //     firstName: "",
        //     lastName: "",
        //     email: "",
        //     age: "",
        //     address: "",
        // })
    }
    render() {
        return (
            <div className="main">
                <div className="newLoading">
                    <DualRing color="red" />
                </div>
                <div className="container1">
                    <div className="signup-content">
                        <div className="signup-img">
                            <img src="/images/signup-img.jpg" alt="" />
                        </div>
                        <div className="signup-form">
                            <form method="POST" className="register-form" id="register-form" onSubmit={this.submit}>
                                <h2>Instructor registration form</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name :</label>
                                        <input type="text" name="name" id="name" required onChange={(e) => { this.setState({ firstName: e.target.value }) }} value={this.state.firstName} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="father_name">Last Name :</label>
                                        <input type="text" name="father_name" id="father_name" required onChange={(e) => { this.setState({ lastName: e.target.value }) }} value={this.state.lastName} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address :</label>
                                    <input type="text" name="address" id="address" required onChange={(e) => { this.setState({ address: e.target.value }) }} value={this.state.address} />
                                </div>
                                {/* <div className="form-radio">
                                    <label htmlFor="gender" className="radio-label">Gender :</label>
                                    <div className="form-radio-item">
                                        <input type="radio" name="gender" id="male" checked />
                                        <label htmlFor="male">Male</label>
                                        <span className="check"></span>
                                    </div>
                                    <div className="form-radio-item">
                                        <input type="radio" name="gender" id="female" />
                                        <label htmlFor="female">Female</label>
                                        <span className="check"></span>
                                    </div>
                                </div> */}
                                <div className="form-group">
                                    <label htmlFor="address">Email :</label>
                                    <input type="email" name="email" id="email" required onChange={(e) => { this.setState({ email: e.target.value }) }} value={this.state.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="birth_date">DOB :</label>
                                    <input type="text" name="birth_date" id="birth_date" onChange={(e) => { this.setState({ age: e.target.value }) }} value={this.state.age} />
                                </div>
                                <div className=" bord">
                                    <div className="text-center">
                                        <img className="cardPic" id="cardPic" alt="avatar"  ></img>
                                        <label className="custom-file-upload">
                                            <input type="file" name='cardPic' ref={(cardPic) => { this.cardPic = cardPic }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                                            <i className="fas fa-upload"></i> Upload Image
                                        </label>

                                    </div>
                                </div>

                                <div className="form-submit">
                                    <input type="submit" value="Reset All" className="submit" name="reset" id="reset" onClick={this.resetAll()} />
                                    <input type="submit" value="Submit Form" className="submit" name="submit" id="submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;