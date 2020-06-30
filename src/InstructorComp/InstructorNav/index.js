import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { read_cookie, bake_cookie } from 'sfcookies'
import socketIOClient from "socket.io-client";
import './style2.css'



class InstructorNav extends Component {

    state = {
        Requests: [],
        Notifications: 0,
        publicVapidKey: 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo',
        width: window.innerWidth,
        height: window.innerHeight,
        bottom: 0,
        notifyHeight: 0,
        count: 10,
        version: 0
    }

    handleScroll = async (event) => {
        var { count } = this.state
        var { version } = this.state
        this.setState({
            bottom: this.notificationsList.getBoundingClientRect().top,
            notifyHeight: this.notificationsList.getBoundingClientRect().height
        })

        if (this.state.bottom < this.state.notifyHeight + 65) {
            const requestOptions = {
                method: 'Get',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
            };
            let api;


            try {
                this.setState({
                    version: version + 1
                })

                var { version } = this.state
                api = await fetch('https://quizly-app.herokuapp.com/Admin/ListMyNotification/' + localStorage.getItem('adminEmail') + '/' + count + '/' + version, requestOptions)
                const data = await api.json();

                this.setState({
                    Requests: this.state.Requests.concat(data),

                })

            }
            catch (e) {
                console.log("no response");
            }
        }
    }
    urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }


    // send = async () => {
    //     // Register Service Worker
    //     const register = await navigator.serviceWorker.register("worker.js", {
    //         scope: "/client",

    //     });


    //     // Register Push
    //     const subscription = await register.pushManager.subscribe({
    //         userVisibleOnly: true,
    //         applicationServerKey: this.urlBase64ToUint8Array(this.state.publicVapidKey)
    //     });

    //     // Send Push Notification
    //     let api = await fetch("https://quizly-app.herokuapp.com/Instructor/subscribe", {
    //         method: "POST",
    //         body: JSON.stringify(subscription),
    //         headers: {
    //             "content-type": "application/json",
    //             'Authorization': localStorage.getItem("token")
    //         }
    //     });
    //     console.log("Notifications: ", api)

    // }


    componentDidMount = async () => {
        this.notificationsList.addEventListener('scroll', this.handleScroll);
        var { version } = this.state
        var { count } = this.state
        // this.send();
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") }
        };
        let api;
        let notiNum = 0

        try {
            api = await fetch('https://quizly-app.herokuapp.com/Instructor/ListMyNotification/' + localStorage.getItem('instructorEmail') + '/' + count + '/' + version, requestOptions)
            const data = await api.json();
            console.log(data)
            data.map((noti) => {
                if (noti.Seen == false) {
                    notiNum = notiNum + 1
                }
            })
            this.setState({
                Requests: data,
                Notifications: notiNum

            })
        }
        catch (e) {
            console.log(e);
        }

        const socket = socketIOClient("https://quizly-app.herokuapp.com")
        socket.on('Send', () => {
            this.setState({
                Notifications: this.state.Notifications + 1
            })
            // this.send();
        })
    }


    Logout = async (type = "one") => {
        const requestOptions = {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") }
        };
        let api;
        if (type == "one") {

            try {
                api = await fetch('https://quizly-app.herokuapp.com/instructor/logout', requestOptions)
                const data = await api.json();
                console.log(data)

            }
            catch (e) {
                console.log(e);
            }
        }
        else{
            try {
                api = await fetch('https://quizly-app.herokuapp.com/instructor/logoutfromall', requestOptions)
                const data = await api.json();
                console.log(data)

            }
            catch (e) {
                console.log(e);
            }
        }
        localStorage.removeItem("token")
        localStorage.removeItem("instructorID")
        localStorage.removeItem("instructorEmail")
        localStorage.removeItem("instructorFirstName")
        localStorage.removeItem("instructorLastName")
        localStorage.removeItem("instructorAddress")
        localStorage.removeItem("instructorAge")
        localStorage.removeItem("pic")

        this.props.history.push('/login')

    }

    componentWillMount() {
        clearInterval(this.interval);
        window.removeEventListener('resize', this.updateDimensions);

    }
    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };


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
            var url = "https://quizly-app.herokuapp.com/Instructor/SeenNotification/" + notify;
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
        this.props.history.push('/adminHome')
        this.props.history.push('/adminHome/adminInstractors')

    }





    render() {
        const url = 'https://quizly-app.herokuapp.com/instructor/' + localStorage.getItem('instructorID') + '/pic';
        const { Requests } = this.state;
        let Notifications = 0;
        const NotificationsList = Requests.map((request, index) => {
            var className = request.Seen ? "dropdown-item d-flex align-items-center pointer hover" : "dropdown-item d-flex align-items-center hover pointer notSeen"
            var date = request.date.split("T")[0];
            var time = request.date.split("T")[1].split(".")[0];
            var dates = date.split("-")
            var times = time.split(":")
            var notiDate = new Date(parseInt(dates[0]), parseInt(dates[1]) - 1, parseInt(dates[2]), parseInt(times[0]), parseInt(times[1]), parseInt(times[2]))


            // var toDay = new Date();
            // var today = this.formatDate(toDay)
            var Difference_In_Time = new Date().getTime() - notiDate.getTime();
            var Difference = Difference_In_Time / (1000 * 60);
            let diff = parseInt(Difference)
            var output = diff + "m"

            if (Difference > 60) {
                Difference /= 60
                let diff = parseInt(Difference)
                output = diff + "h"
            }

            if (Difference > 24) {
                Difference /= 24
                let diff = parseInt(Difference)
                output = diff + "d"
            }

            return (
                <a className={className} key={index} onClick={() => { this.seeNotification(request._id, request.Seen) }}>
                    <div className="mr-3">
                        <div className="icon-circle bg-success">
                            <i className="fas fa-envelope-open-text"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">{output}</div>
                        {request.Sender_email}  has request to join quizly
                    </div>
                </a>
            )
        })


        return (
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow navbar2">

                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>
                {/* <div className="flex1">
                    <Link to = "/instructorHome/addingQuestion" className="addQuestions btn btn-success btn-icon-split btn-sm " >
                        <span className="icon text-white-50">
                            <i class="fas fa-plus-square"></i>
                        </span>
                        <span className="text">Add New Question</span>
                    </Link>
                </div> */}
                <ul className=" navbar-nav ml-auto ">



                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link noti dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw"></i>
                            <span className="badge badge-danger badge-counter requests9">{this.state.Notifications == 0 ? "" : this.state.Notifications + "+"}</span>
                        </a>
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Alerts Center
                            </h6>
                            <div className="notificationsList" ref={(notificationsList) => { this.notificationsList = notificationsList }} style={{ "height": this.state.height * 0.6 }}>
                                {NotificationsList}
                            </div>
                            <Link className="dropdown-item text-center small text-gray-500" to="/instructorHome/instructorInstructors">Show All Alerts</Link>
                        </div>
                    </li>



                    <div className="topbar-divider d-none d-sm-block"></div>

                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{localStorage.getItem('instructorFirstName')}</span>
                            <img className="img-profile rounded-circle" src={url} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in requests" aria-labelledby="userDropdown">
                            <Link className="dropdown-item" to="/instructorHome/instructorProfile">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Profile
                            </Link>


                            <Link className="dropdown-item" to={{
                                pathname: "/instructorHome/questionBank",
                                state: {
                                    url: "https://quizly-app.herokuapp.com/instructor/getmyQuestions/"
                                }
                            }}  >
                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                My Questions
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item"  onClick={() => this.Logout("one")} >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </button>
                            <button className="dropdown-item"  onClick={() => this.Logout("all")} >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout from all devices
                            </button>
                        </div>
                    </li>

                </ul>

            </nav>
        )
    }
}

export default withRouter( InstructorNav);