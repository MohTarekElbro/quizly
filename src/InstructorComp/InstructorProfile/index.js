import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './style.css'
import $ from 'jquery'
import { read_cookie, bake_cookie } from 'sfcookies'
class InstructorProfile extends React.Component {

    state = {
        firstName: read_cookie('instructorFirstName'),
        lastName: read_cookie ('instructorLastName'),
        email: read_cookie('instructorEmail'),
        age: read_cookie('instructorAge'),
        address: read_cookie('instructorAddress'),
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
    componentDidMount = () => {
        $('#instructorPic')
            .attr('src', 'https://quizly-app.herokuapp.com/instructor/' + read_cookie('instructorID') + '/pic')
            .width(240)
            .height(300);
    }

    updateProfile = async (e) => {
        e.preventDefault()
        const { firstName } = this.state
        const { lastName } = this.state
        const { age } = this.state
        const { address } = this.state
        const { email } = this.state
        const { oldPassword } = this.state
        const { newPassword } = this.state
        const { confirmPassword } = this.state
        console.log(email, newPassword, confirmPassword)

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                'Email': email,
                'Password': newPassword,
                'Frist_Name': firstName,
                'Last_Name': lastName,
                'Age': age,
                'Address': address,
            })
        };
        let api;
        if (confirmPassword === newPassword && email.includes("@") && email.includes(".")) {
            try {
                api = await fetch('https://quizly-app.herokuapp.com/instructor/editme' + oldPassword, requestOptions)
                const data = await api.json();
                console.log("EditProfileData: ", data)
                bake_cookie("instructorEmail", data.Email);
                bake_cookie("instructorAddress", data.Address);
                bake_cookie("instructorAge", data.Age);
                bake_cookie("instructorFirstName", data.Frist_Name);
                bake_cookie("instructorLastName", data.Last_Name);
                this.setState({
                    firstName: read_cookie('instructorFirstName'),
                    lastName: read_cookie('instructorLastName'),
                    email: read_cookie('instructorEmail'),
                    age: read_cookie('instructorAge'),
                    address: read_cookie('instructorAddress'),
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert("Password Confirmation is wrong! ")
        }

    }

    uploadImage = (e) => {
        let input = this.instructorPic
        console.log(input.files[0])
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#instructorPic')
                    .attr('src', e.target.result)
                    .width(240)
                    .height(300);
                $('.saveImg').css('display', 'block')
            };

            reader.readAsDataURL(input.files[0]);


        }
    }

    saveImage = async () => {

        let file = this.instructorPic.files[0]
        console.log(file)
        let formData = new FormData()
        formData.append('image', file)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': read_cookie("token") },
            body: formData
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/upload/profilePicture', requestOptions).then(res => {


                const api2 = fetch('https://quizly-app.herokuapp.com/instructor/' + read_cookie('instructorID') + '/pic').then(res => {
                    bake_cookie('pic', res)
                    console.log(res)
                })
                this.props.history.push('/login')
                this.props.history.push('/instructorHome/instructorProfile')
                // window.location.reload(false)
            })





        }
        catch (e) {
            console.log(e);
        }


    }


    render() {
        return (
            <div className="container profileform">
                <h1>Edit Profile</h1>
                <hr />
                <div className="row">
                    <div className="col-md-3 bord">
                        <div className="text-center">
                            <img className="instructorPic" id="instructorPic" alt="avatar"  ></img>
                            <label className="custom-file-upload">
                                <input type="file" name='instructorPic' ref={(instructorPic) => { this.instructorPic = instructorPic }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                                <i className="fas fa-upload"></i> Upload Image
                            </label>

                            <button className="saveImg btn btn-primary" onClick={() => { this.saveImage() }}> Save Image</button>
                        </div>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-7 personal-info">
                        {/* <div className="alert alert-info alert-dismissable">
                        <a className="panel-close close" data-dismiss="alert">×</a>
                        <i className="fa fa-coffee"></i>
                        This is an <strong>.alert</strong>. Use this to show important messages to the user.
                    </div> */}
                        <h3>Personal info</h3>

                        <form className="form-horizontal" onSubmit={this.updateProfile} role="form">
                            <div className="form-group">
                                <label className="col-lg-3 control-label">First Name:</label>
                                <div className="col-lg-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ firstName: e.target.value })} value={this.state.firstName} name="firstName" type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Last Name:</label>
                                <div className="col-lg-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ lastName: e.target.value })} value={this.state.lastName} name="lastName" type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Email:</label>
                                <div className="col-lg-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} name="email" type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Age:</label>
                                <div className="col-lg-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ age: e.target.value })} value={this.state.age} name="age" type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Address:</label>
                                <div className="col-lg-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ address: e.target.value })} value={this.state.address} name="address" type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-3 control-label">Password:</label>
                                <div className="col-md-8">
                                    <input className="form-control" onChange={(e) => this.setState({ oldPassword: e.target.value })} value={this.state.oldPassword} name="oldPassword" type="password" placeholder='Old Password' />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-3 control-label">New password:</label>
                                <div className="col-md-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ newPassword: e.target.value })} value={this.state.newPassword} name="newPassword" type="password" placeholder='New Password' />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-3 control-label">Confirm password:</label>
                                <div className="col-md-8">
                                    <input className="form-control" required onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={this.state.confirmPassword} type="password" placeholder='Confirm Password' />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-3 control-label"></label>
                                <div className="col-md-8">
                                    <input type="submit" className="btn btn-primary" value="Save Changes" />
                                    <span></span>
                                    <input type="reset" className="btn btn-default" value="Cancel" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(InstructorProfile);