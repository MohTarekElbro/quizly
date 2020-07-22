import React, { Component } from 'react'
import './style.css'
import { bake_cookie, read_cookie } from 'sfcookies'
import $ from 'jquery'
import loadjs from 'loadjs'
import Modal from '../../components/Modal'
// import '../../custom.js'




class AdminDomains extends Component {

    state = {
        Requests: [],
        loadjs,
        pageContent: "listRequests",
        domainName: "",
        description: "",
        oldDomains: [],
        Notifications: []
    }

    seeNotification = async (notify, ifSeen) => {
        if (ifSeen == false) {
            this.setState({
                Notifications: this.state.Notifications - 1
            })
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") }
            };
            let api;
            var url = "https://quizly-app.herokuapp.com/Admin/SeenNotification/" + notify._id;
            console.log("URL: ", url)

            try {
                api = await fetch(url, requestOptions)
                const data = await api.json();
                console.log("SeenNotify: ", data)
                let i = 0;
                var { Requests } = this.state
                Requests.map((request, index) => {
                    if (request._id == data._id) {
                        i = index;
                    }
                })
                Requests[i] = data
                this.setState({
                    Requests: Requests
                })
            }
            catch (e) {
                console.log(e);
            }
        }
    }


    componentDidMount = async () => {
        const requestOptions1 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") }
        };
        let api1;
        let notifications = [];
        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/Admin/ListMyNotification/' + localStorage.getItem('adminEmail') + '/' + 100 + '/' + 0, requestOptions1)

            notifications = await api1.json();

            this.setState({
                Notifications: notifications

            })
        }
        catch (e) {
            console.log(e);
        }

        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/domain/requests', requestOptions)
            const data = await api.json();
            console.log("data: ", data)
            data.map((ins) => {
                notifications.map((noti) => {
                    if (ins.Email == noti.Sender_email) {
                        this.seeNotification(noti, noti.Seen)
                    }
                })
            })
            this.setState({
                Requests: data,
            })
        }
        catch (e) {
            console.log(e);
        }

        const requestOptions3 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', },
        };
        let api2;

        try {
            api2 = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions)
            const data2 = await api2.json();
            console.log("Domains: ", data2)

            this.setState({
                oldDomains: data2,
            })
        }
        catch (e) {
            console.log(e);
        }





    }



    AddNewDomain = async () => {
        // console.log(this.state.domainName, this.state.description, this.state.filePath)
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

        else {
           
            const requestOptions = {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                body: JSON.stringify({
                    "domain_name": this.state.domainName,
                    "description": this.state.description
                })
            };
            let api;

            try {
                api = await fetch('https://quizly-app.herokuapp.com/admin/domains/add', requestOptions)
                const data = await api.json();
                this.setState({
                    domainName: "",
                    description: "",
                    
                })
                $.alert({
                    title: 'Success!',
                    content: 'Domain Added!',
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


                    <div class="row">
                        <div class="col-sm-12 form-group">
                            <button class="btn btn-lg btn-warning btn-block submit" onClick={() => this.AddNewDomain()} value="Post" >Post</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    deleteDomain = async (id) => {
        const requestOptions = {
            method: 'delete',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/' + id, requestOptions)
            const data = await api.json();
            let { oldDomains } = this.state
            this.state.oldDomains.map((req, index) => {
                if (req._id == id) {
                    oldDomains.splice(index, 1)
                    this.setState({
                        oldDomains
                    })
                }
            })
            console.log(data)
        }
        catch (e) {
            console.log("no response: ", e);
        }
    }

    AcceptDomain = async (id) => {
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/domainrequests/' + id + '/add', requestOptions)
            const data = await api.json();
            let { Requests } = this.state
            this.state.Requests.map((req, index) => {
                if (req._id == id) {
                    Requests.splice(index, 1)
                    this.setState({
                        Requests
                    })
                }
            })
            console.log(data)


        }
        catch (e) {
            console.log("no response: ", e);
        }
    }
    getDomains = async (Domains) => {
        const requestOptions3 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', },
        };
        let api2;

        try {
            api2 = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions3)
            const data2 = await api2.json();
            console.log("Domains: ", data2)
            if (Domains.length != data2.length) {
                console.log("a7a")
                this.setState({
                    oldDomains: data2,
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    listDomains = (Domains) => {
        this.getDomains(Domains)
        console.log("Data")
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
                            <p className="center">Domain: {Domain.domain_name} </p>
                            <p className="center">Description: {Domain.description} </p>
                        </div>
                        <div className="listButtons ">

                            <button onClick={() => { this.deleteDomain(Domain._id) }} className="btn btn-danger btn-icon-split btn-sm">
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

    listRequests = (Domains) => {
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
                            <p className="center">Email: {Domain.requester.Email} </p>
                            <p className="center">Domain: {Domain.Requested_domain} </p>
                            <p className="center">Description: {Domain.description} </p>
                        </div>
                        <div className="listButtons ">

                            <button onClick={() => { this.AcceptDomain(Domain._id) }} className="btn btn-success btn-icon-split btn-sm">
                                <span className="icon text-white-50">
                                    <i className="far fa-check-circle"></i>
                                </span>
                                <span className="text">Accept</span>
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
        else if (type == "Requests") {
            this.setState({
                pageContent: "listRequests"
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
        else if (pageContent == "listRequests") {
            console.log("MMMM")
            content = this.listRequests(this.state.Requests)
        }
        else {
            content = this.listDomains(this.state.oldDomains)
        }





        return (
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <button onClick={() => this.showNewDomain("Requests")} class="btn btn-primary btn-icon-split btn-sm requests2" >

                        <span class="text">Requests</span>
                    </button>

                    <button onClick={() => this.showNewDomain("add")} class="btn btn-success btn-icon-split btn-sm requests2" >
                        {/* <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span> */}
                        <span class="text">Add Domain</span>
                    </button>

                    <button onClick={() => this.showNewDomain("Domains")} class="btn btn-success btn-icon-split btn-sm requests2" >
                        {/* <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span> */}
                        <span class="text">Domains</span>
                    </button>
                </div>
                <div className="ListContainer" >
                    {content}
                </div>
            </div>
        )
    }
}

export default AdminDomains;