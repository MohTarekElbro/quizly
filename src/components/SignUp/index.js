import React, { Component } from 'react'
import './style.css'
import './style1.css'
import $ from 'jquery'
import socketIOClient from "socket.io-client";
import { read_cookie } from 'sfcookies'
import { DualRing } from 'react-spinners-css';

class SignUp extends Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        address: "",
        firstNameV: "none",
        lastNameV: "none",
        emailV: "none",
        ageV: "none",
        addressV: "none",
        img: "",
        imgV: "none"
    }

    componentDidMount = () => {
        $(".newLoading").css("display", "none")
    }

    submit = async (e) => {
        if (this.validation() == false) {

            console.log("validation: ", this.validation())
            $.alert({
                title: 'Error!',
                content: 'Follow validation rules!',
                buttons: {
                    okay: () => {
                        this.setState({
                            firstNameV: "false",
                            lastNameV: "false",
                            emailV: "false",
                            ageV: "false",
                            addressV: "false",
                            imgV: "false"
                        })
                    },

                }
            });

        }
        else {
            $(".newLoading").css("display", "flex")
            // e.preventDefault()
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
                // console.log(this.state.firstName,this.state.lastName,this.state.email,this.state.address,this.state.age,file)
                api = await fetch('https://quizly-app.herokuapp.com/instructor/signup', requestOptions)
                console.log(api.status)
                if (api.status == 200) {
                    $.alert({
                        title: 'Success!',
                        content: 'Your request has been sent to the supervisor, wait for the response on your email',
                        buttons: {
                            okay: () => { this.resetAll(); $(".newLoading").css("display", "none") },

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

    }

    uploadImage = (e) => {
        let input = this.cardPic
        console.log(input.files[0])
        if (input.files && input.files[0] && (this.cardPic.files[0].name.includes(".jpg") || this.cardPic.files[0].name.includes(".png"))) {
            this.setState({
                imgV: "true"
            })
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
        this.setState({
            firstName: "",
            lastName: "",
            email: "",
            age: "",
            address: "",
            firstNameV: "none",
            lastNameV: "none",
            emailV: "none",
            ageV: "none",
            addressV: "none",
            imgV: "none"
        })
        $('#cardPic')
            .css("display", "none")
            .css("margin", "0 auto")
            .attr('src', "")
            .width(0)
            .height(0);
    }

    validation = () => {
        let { firstName } = this.state
        let { lastName } = this.state
        let { email } = this.state
        let { address } = this.state
        let { age } = this.state
        let flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false, flag6 = false
        // /[!@#$%^&*(),.?":{}|<>]/g.test(firstName) || !/^[A-Z]/.test(firstName) || /\d+/g.test(firstName) ||
        if ((firstName.length < 3 || /[!@#123456789[0$%^&*(),.?":{}|<>]/g.test(firstName) || !/^[A-Z]/.test(firstName)) && this.state.firstNameV != "none") {
            console.log("css and v")
            $("#name").css({ "border": "1px solid red" })
            $("#firstNameV").css("display", "block")
            flag1 = false
        }
        else if ((firstName.length < 3 || /[!@#123456789[0$%^&*(),.?":{}|<>]/g.test(firstName) || !/^[A-Z]/.test(firstName)) && this.state.firstNameV == "none") {
            console.log("just v")
            flag1 = false
        }
        else {
            $("#name").css({ "border": "1px solid #ebebeb" })
            $("#firstNameV").css("display", "none")
            flag1 = true
        }



        if ((lastName.length < 3 || /[!@#123456789[0$%^&*(),.?":{}|<>]/g.test(lastName) || !/^[A-Z]/.test(lastName)) && this.state.lastNameV != "none") {
            $("#father_name").css({ "border": "1px solid red" })
            $("#lastNameV").css("display", "block")
            flag2 = false
        }
        else if ((lastName.length < 3 || /[!@#123456789[0$%^&*(),.?":{}|<>]/g.test(lastName) || !/^[A-Z]/.test(lastName)) && this.state.lastNameV == "none") {
            flag2 = false
        }
        else {
            $("#father_name").css({ "border": "1px solid #ebebeb" })
            $("#lastNameV").css("display", "none")

            flag2 = true
        }



        if ((address.length < 3 || /[!@#[0$%^&*(),.?":{}|<>]/g.test(address)) && this.state.addressV != "none") {
            $("#address").css({ "border": "1px solid red" })
            $("#addressV").css("display", "block")
            flag3 = false

        }
        else if ((address.length < 3 || /[!@#[0$%^&*(),.?":{}|<>]/g.test(address)) && this.state.addressV == "none") {
            flag3 = false
        }
        else {
            $("#address").css({ "border": "1px solid #ebebeb" })
            $("#addressV").css("display", "none")

            flag3 = true
        }


        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email) && this.state.emailV != "none") {
            $("#email").css({ "border": "1px solid red" })
            $("#emailV").css("display", "block")
            flag4 = false
        }
        else if (!re.test(email) && this.state.emailV == "none") {
            flag4 = false
        }
        else {
            $("#email").css({ "border": "1px solid #ebebeb" })
            $("#emailV").css("display", "none")

            flag4 = true
        }


        if (age.length < 2 && this.state.ageV != "none") {
            $("#birth_date").css({ "border": "1px solid red" })
            $("#ageV").css("display", "block")
            flag5 = false
        }
        else if (age.length < 2 && this.state.ageV == "none") {
            flag5 = false
        }
        else {
            $("#birth_date").css({ "border": "1px solid #ebebeb" })
            $("#ageV").css("display", "none")
            flag5 = true
        }
        // this.cardPic

        if (this.cardPic) {
            if (this.cardPic.files[0]) {
                if ((!this.cardPic.files[0].name.includes(".jpg") && !this.cardPic.files[0].name.includes(".png")) && this.state.imgV != "none") {
                    $(".custom-file-upload").css({ "border": "1px solid red" })
                    $("#imgV").css("display", "block")
                    flag6 = false
                }
                else if ((!this.cardPic.files[0].name.includes(".jpg") && !this.cardPic.files[0].name.includes(".png")) && this.state.imgV == "none") {
                    flag6 = false
                }
                else {
                    $(".custom-file-upload").css({ "border": "1px solid #ebebeb" })
                    $("#imgV").css("display", "none")
                    flag6 = true
                }
            }
            else if (this.state.imgV != "none") {
                flag6 = false
                $(".custom-file-upload").css({ "border": "1px solid red" })
                $("#imgV").css("display", "block")

            }
        }
        else {

        }

        // console.log(flag1, flag2, flag3, flag4, flag5)

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            return true
        }
        else {
            return false
        }
    }
    render() {
        this.validation()
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
                            <div className="register-form" >
                                <h2>Instructor registration form</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">First Name :</label>
                                        <input type="text" name="name" id="name" required onChange={(e) => { this.setState({ firstName: e.target.value }); if (this.state.firstNameV == "none") { this.setState({ firstNameV: "false" }) } }} value={this.state.firstName} />
                                        <p className="validError" id="firstNameV">start with uppercase, more than 2 letters</p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="father_name">Last Name :</label>
                                        <input type="text" name="father_name" id="father_name" required onChange={(e) => { this.setState({ lastName: e.target.value }); if (this.state.lastNameV == "none") { this.setState({ lastNameV: "false" }) } }} value={this.state.lastName} />
                                        <p className="validError" id="lastNameV">start with uppercase, more than 2 letters</p>

                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address :</label>
                                    <input type="text" name="address" id="address" required onChange={(e) => { this.setState({ address: e.target.value }); if (this.state.addressV == "none") { this.setState({ addressV: "false" }) } }} value={this.state.address} />
                                    <p className="validError" id="addressV"> more than 10 letters</p>

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
                                    <input type="email" name="email" id="email" required onChange={(e) => { this.setState({ email: e.target.value }); if (this.state.emailV == "none") { this.setState({ emailV: "false" }) } }} value={this.state.email} />
                                    <p className="validError" id="emailV">Enter email form</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="birth_date">Age :</label>
                                    <input type="number" name="birth_date" id="birth_date" onChange={(e) => { this.setState({ age: e.target.value }) }} value={this.state.age} />
                                    <p className="validError" id="ageV">more than 1 number</p>

                                </div>
                                <div className=" bord">
                                    <div className="text-center" style={{ "position": "relative" }}>
                                        <img className="cardPic" id="cardPic" alt="avatar"  ></img>
                                        <label className="custom-file-upload">
                                            <input type="file" name='cardPic' ref={(cardPic) => { this.cardPic = cardPic }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                                            <i className="fas fa-upload"></i> Upload your ID
                                        </label>
                                        <p className="validError" id="imgV">Upload 'png' or 'jpg' image of your ID card </p>


                                    </div>
                                </div>

                                <div className="form-submit">
                                    <input type="submit" value="Reset All" className="submit" name="reset" id="reset" onClick={() => this.resetAll()} />
                                    <input type="submit" value="Submit Form" className="submit" name="submit" id="submit" onClick={() => this.submit()} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;