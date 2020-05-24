import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './style.css'
import $ from 'jquery'
import { read_cookie, bake_cookie } from 'sfcookies'
class AdminProfile extends React.Component {

    state = {
        email: read_cookie('adminEmail'),
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
    componentDidMount = () => {
        $('#adminPic')
            .attr('src', 'https://quizly-app.herokuapp.com/admin/'+read_cookie("adminID")+'/pic')
            .width(150)
            .height(200);
    }

    updateProfile = async (e) => {
        e.preventDefault()
        const email = this.state.email
        const { newPassword } = this.state
        const { confirmPassword } = this.state
        const { oldPassword } = this.state
        const url  = "https://quizly-app.herokuapp.com/admin/me"+oldPassword;
        console.log(email,oldPassword , newPassword , confirmPassword ,url )

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                'email': email,
                'password': newPassword
            })
        };
        let api;
        if (confirmPassword === newPassword && email.includes("@") && email.includes(".")) {
            try {
                api = await fetch(url, requestOptions)
                const data = await api.json();

                bake_cookie("adminEmail", data.email);
                this.setState({
                    email: read_cookie('adminEmail'),
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
            catch (e) {
                console.log(e);
            }
        }
        else{
            alert("Password Confirmation is wrong! ")
        }

    }

    uploadImage = (e) => {
        let input = this.adminPic
        console.log(input.files[0])
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#adminPic')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
                $('.saveImg').css('display', 'block')
            };

            reader.readAsDataURL(input.files[0]);


        }
    }

    saveImage = async () => {

        let file = this.adminPic.files[0]
        let formData = new FormData()
        formData.append('image', file)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': read_cookie("token") },
            body: formData
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/upload/profilePicture', requestOptions).then(res => {

                console.log("UpdateProfile REsponse: ",res);
                const api2 = fetch('https://quizly-app.herokuapp.com/admin/' + read_cookie('adminID') + '/pic').then(res2 => {
                    bake_cookie('pic', res2)
                    console.log(res2)
                })
                this.props.history.push('/login')
                this.props.history.push('/adminHome/adminProfile')
                // window.location.reload(false)
            })





        }
        catch (e) {
            console.log(e);
        }


    }


    render() {
        return (
            <div class="container profileform" style = {{"margin-top": "70px" }}>
                <h1>Edit Profile</h1>
                <hr />
                <div class="row">
                    <div class="col-md-3 bord">
                        <div class="text-center">
                            <img className="adminPic" id="adminPic" alt="avatar"  ></img>
                            <label className="custom-file-upload">
                                <input type="file" name='adminPic' ref={(adminPic) => { this.adminPic = adminPic }} onChange={() => this.uploadImage()} class="fileInput form-control" />
                                <i class="fas fa-upload"></i> Upload Image
                            </label>

                            <button className="saveImg btn btn-primary" onClick={() => { this.saveImage() }}> Save Image</button>
                        </div>
                    </div>
                    <div className="col-md-2"></div>

                    <div class="col-md-7 personal-info">
                        {/* <div class="alert alert-info alert-dismissable">
                        <a class="panel-close close" data-dismiss="alert">×</a>
                        <i class="fa fa-coffee"></i>
                        This is an <strong>.alert</strong>. Use this to show important messages to the user.
                    </div> */}
                        <h3>Personal info</h3>

                        <form class="form-horizontal" onSubmit={this.updateProfile} role="form">
                            <div class="form-group">
                                <label class="col-lg-3 control-label">Email:</label>
                                <div class="col-lg-8">
                                    <input class="form-control" required onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} name="email" type="text"  />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">Password:</label>
                                <div class="col-md-8">
                                    <input class="form-control"  onChange={(e) => this.setState({ oldPassword: e.target.value })} value={this.state.oldPassword} name="oldPassword" type="password" placeholder='Old Password' />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">New password:</label>
                                <div class="col-md-8">
                                    <input class="form-control" required onChange={(e) => this.setState({ newPassword: e.target.value })} value={this.state.newPassword} name="newPassword" type="password" placeholder='New Password' />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">Confirm password:</label>
                                <div class="col-md-8">
                                    <input class="form-control" required onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={this.state.confirmPassword} type="password" placeholder='Confirm Password' />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label"></label>
                                <div class="col-md-8">
                                    <input type="submit" class="btn btn-primary" value="Save Changes" />
                                    <span></span>
                                    <input type="reset" class="btn btn-default" value="Cancel" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(AdminProfile);