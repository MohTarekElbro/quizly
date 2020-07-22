import React, { Component } from 'react'
import './style.css'
import { bake_cookie, read_cookie } from 'sfcookies'
import $ from 'jquery'
import loadjs from 'loadjs'
import Modal from '../../components/Modal'
// import '../../custom.js'




class InstructorRequests extends Component {

    state = {
        Requests: [],
        loadjs,
        pageContent: "addNewDomain",
        domainName: "",
        description: "",
        fileName: "",
        filePath: ""



    }


    componentDidMount = async () => {

        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions)
            const data = await api.json();
            this.setState({
                Requests: data,

            })

        }
        catch (e) {
            console.log(e);
        }
        console.log("componentDidMount")

        this.setState({
            loadjs: loadjs('js/demo/datatables-requests.js')
        })


    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/requests', requestOptions)
            const data = await api.json();
            this.setState({
                Requests: data
            })

        }
        catch (e) {
            console.log("no response");
        }


        this.props.history.push("/InstructorProfile")
        this.props.history.push("/InstructorHome/InstructorRequests")


    }


    Vote = async (ID) => {
        console.log(ID)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/vote/' + ID, requestOptions)
            const data = await api.json();


        }
        catch (e) {
            console.log("no response");
        }

        const refresh = () => this.Refresh()
        refresh()
    }


    AddNewDomain = async () => {
        console.log(this.state.domainName, this.state.description, this.state.filePath)
        if (this.state.domainName == "") {
            console.log("this.state.domainName: ", this.state.domainName)
            $.alert({
                title: 'Error!',
                content: 'You must enter your domain name',
                buttons: {
                    okay: function () { },

                }
            });
        }
        else if (this.state.description == "") {
            console.log("this.state.description: ", this.state.description)

            $.alert({
                title: 'Error!',
                content: 'You must enter your domain description',
                buttons: {
                    okay: function () { },

                }
            });
        }
        else if (this.state.fileName == "") {
            $.alert({
                title: 'Error!',
                content: 'You must upload your pdf file',
                buttons: {
                    okay: function () { },

                }
            });
        }
        else {
            let file = this.txtFile.files[0]
            let formData = new FormData()
            formData.append('material', file)
            formData.append("Requested_domain", this.state.domainName)
            formData.append("description", this.state.description)
            const requestOptions = {
                method: 'post',
                headers: { 'Authorization': localStorage.getItem('token') },
                body: formData
            };
            let api;

            try {
                api = await fetch('https://quizly-app.herokuapp.com/domain/request', requestOptions)
                const data = await api.json();
                this.setState({
                    domainName: "",
                    description: "",
                    fileName: "",
                    filePath: ""
                })
                $.alert({
                    title: 'Success!',
                    content: 'your request has been sent',
                    buttons: {
                        okay: function () { },

                    }
                });
                console.log(data)

            }
            catch (e) {
                console.log(e);
            }
        }
    }

    uploadImage = async (e) => {
        let file = this.txtFile.files[0]
        // console.log(file.name)
        if (file) {
            if (file.name.includes(".pdf")) {
                this.setState({
                    fileName: file.name
                })
                $('.saveImg').css('display', 'block')
            }
            else {
                $.alert({
                    title: 'Error!',
                    content: 'You must upload "pdf" file',
                    buttons: {
                        okay: function () { },

                    }
                });
            }
        }
    }

    newDomainForm = () => {
        return (
            <div class="flex row" >
                <div class="form-container  ">
                    <h2>Add New Domain</h2>
                    {/* this.textarea.value = this.state.description */}

                    <div class="row optionItem " id="textarea" >
                        <div class="col-sm-12 form-group">
                            <textarea placeholder="Description" class="generateQuestionText" type="text" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} />

                        </div>
                    </div>
                    <div className="levels">
                        <input type="text" className="form-control bg-light  small inputSearch" style={{ "marginBottom": "20px" }} placeholder="Domain Name"
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.domainName} onChange={(e) => { this.setState({ domainName: e.target.value }) }} />
                    </div>

                    <div className="uploadTxtFile  optionItem" id="uploadInput">
                        <label className="uploadFile" style={{ "marginTop": "0px" }}>
                            <input type="file" name='txtFile' ref={(txtFile) => { this.txtFile = txtFile }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                            <i className="fas fa-upload"></i> Upload PDF file
                            </label>

                        <p className="" > {this.state.fileName}</p>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group">
                            <button class="btn btn-lg btn-warning btn-block submit" onClick={() => this.AddNewDomain()} value="Post" >Post</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    listDomains = (Domains) => {
        if (Domains[0] == null) {
            console.log("MMMMMMMMMMMMMMMMMMM")
            return (
                <div style={{ "width": "100%", "display": "flex", "justifyContent": "center", }}>
                    <div class="text-center" >
                        {/* <div class="error mx-auto" data-text="404">404</div> */}
                        <p class=" error mx-auto lead text-gray-800 mb-5" data-text="No Domains Available" style={{ "fontSize": "30px" }}>No Domains Available</p>
                        {/* <p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p> */}
                    </div>
                </div>
            )
        }
        else {
            console.log("Domains: ", Domains)
            return Domains.map((Domain, index) => {
                var month = new Date(Domain.createdAt).toString().split(" ")[1]
                var day = new Date(Domain.createdAt).toString().split(" ")[2]

                return (
                    <div className="instructorItem ">
                        <div className="listDate ">
                            <div className="date1">
                                <p>{day}</p>
                                <p>{month}</p>
                            </div>

                        </div>
                        <div className="listData ">
                            <p className="center">Email: {Domain.requester} </p>
                            <p className="center">Domain: {Domain.Requested_domain} </p>
                            <p className="center">Description: {Domain.description} </p>
                        </div>
                        <div className="listButtons ">

                            <button onClick={() => { this.delete(Domain._id) }} className="btn btn-danger btn-icon-split btn-sm">
                                <span className="icon text-white-50">
                                    <i className="far fa-times-circle"></i>
                                </span>
                                <span className="text">Delete</span>
                            </button>
                        </div>
                    </div>
                )
            })
        }
    }
    showNewDomain = (type) => {
        if (type == "add") {
            this.setState({
                pageContent: "addNewDomain"
            })
        }
        else {
            this.setState({
                pageContent: "listDomains"
            })
        }

        window.removeEventListener('scroll', this.handleScroll);
    }


    render() {
        // console.log("Render")
        if (this.textarea) {
            this.textarea.value = this.state.description

        }
        const { Requests } = this.state
        const { pageContent } = this.state
        let content;
        if (pageContent == "addNewDomain") {
            content = this.newDomainForm()
        }
        else if (pageContent == "listDomains") {
            console.log("MMMM")
            content = this.listDomains(this.state.Requests)
        }

        const ListRequests = Requests.map((Request, index) => {
            return (
                <tr className="THrequest">
                    <td className="TDrequest" >{Request.Requested_domain}</td>
                    {/* <td>{Request.requester.Email}</td> */}
                    <td>{Request.votes}</td>
                    <td>
                        <button type="button" onClick={() => { this.Vote(Request.Requested_domain) }} class="btn btn-success btn-icon-split btn-sm " data-toggle="modal" data-target="#exampleModal">
                            <span class="icon text-white-50">
                                <i class="fas fa-vote-yea"></i>
                            </span>
                            {/* <span class="text">vote</span> */}
                        </button>
                    </td>
                </tr>
            )
        })



        return (
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <button onClick={() => this.showNewDomain("list")} class="btn btn-primary btn-icon-split btn-sm requests2" >
                        <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span>
                        {/* <span class="text">Refresh</span> */}
                    </button>

                    <button onClick={() => this.showNewDomain("add")} class="btn btn-success btn-icon-split btn-sm requests2" >
                        {/* <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span> */}
                        <span class="text">Request New Domain</span>
                    </button>
                </div>
                <div className="ListContainer" >
                    {content}
                </div>
            </div>
        )
    }
}

export default InstructorRequests;