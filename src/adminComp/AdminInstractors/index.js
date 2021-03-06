import React, { Component } from 'react'
import './style.css'
import { bake_cookie, read_cookie } from 'sfcookies'
import $ from 'jquery'
import socketIOClient from "socket.io-client";

import loadjs from 'loadjs'
import Modal from '../../components/Modal'
// import '../../custom.js'




class AdminInstractors extends Component {

    state = {
        Instructors: [],
        loadjs,
        bottom: 0,
        height: 0,
        count: 10,
        version: 0,
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
            // console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")

            console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM: " , notifications.length)
            this.setState({
                Notifications: notifications

            })
        }
        catch (e) {
            console.log(e);
        }

        const socket = socketIOClient("https://quizly-app.herokuapp.com")
        socket.on('Send', () => {
            this.Refresh()
        })
        var { count } = this.state
        window.addEventListener('scroll', this.handleScroll);
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/singuprequests/' + count + '/0', requestOptions)
            const data = await api.json();
            this.setState({
                Instructors: data
            })

            data.map((ins) => {
                notifications.map((noti) => {
                    if (ins.Email == noti.Sender_email) {
                        this.seeNotification(noti , noti.Seen)
                    }
                })
            })

        }
        catch (e) {
            console.log("no response");
        }
        console.log("componentDidMount")

        this.setState({
            loadjs: loadjs('js/demo/datatables-demo1.js')
        })
    }

    handleScroll = async (event) => {

        var { count } = this.state
        var { version } = this.state
        this.setState({
            bottom: document.body.getBoundingClientRect().bottom,
            height: window.innerHeight
        })

        if (this.state.bottom < this.state.height + 1) {
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
                api = await fetch('https://quizly-app.herokuapp.com/admin/singuprequests/' + count + '/' + version, requestOptions)
                const data = await api.json();
                this.setState({
                    Instructors: this.state.Instructors.concat(data)
                })

            }
            catch (e) {
                console.log("no response");
            }
        }
    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/singuprequests', requestOptions)
            const data = await api.json();
            this.setState({
                Instructors: data
            })

        }
        catch (e) {
            console.log("no response");
        }


        // this.props.history.push("/adminProfile")
        // this.props.history.push("/adminHome/adminInstractors")
        // console.log("demoStarted")
        // this.setState({
        //     loadjs :loadjs('js/demo/datatables-demo.js')
        // })
        // console.log("demoAdded")
        // console.log("demo1Started")
        // this.setState({
        //     loadjs :loadjs('js/demo/datatables-demo1.js')
        // })
        // console.log("demo1Added")

    }


    Accept = async (ID) => {
        console.log(ID)
        let Instructors = this.state.Instructors
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/singuprequests/' + ID + '/accept', requestOptions)
            // const data = await api.json();
            for (let i = 0; i < Instructors.length; i++) {
                if (Instructors[i]._id == ID) {
                    Instructors.splice(i, 1)
                }
            }
            this.setState({
                Instructors
            })


        }
        catch (e) {
            console.log("no response");
        }

    }

    Reject = async (ID) => {
        let Instructors = this.state.Instructors
        // console.log(Instructors.length)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/singuprequests/' + ID + '/reject', requestOptions)
            // const data = await api.json();
            for (let i = 0; i < Instructors.length; i++) {
                if (Instructors[i]._id == ID) {
                    Instructors.splice(i, 1)
                }
            }
            this.setState({
                Instructors
            })

        }
        catch (e) {
            console.log("no response");
        }
        // const refresh = () => this.Refresh()
        // refresh()
    }

    cardIdPic = (id) => {
        let src = "https://quizly-app.herokuapp.com/instructor/" + id + "/picId"
        return (
            <img className="cardIdPic" src={src} />
        )
    }


    render() {

        const { Instructors } = this.state

        const ListInstractors = Instructors.map((Instractor, index) => {
            var month = new Date(Instractor.RequestDate).toString().split(" ")[1]
            var day = new Date(Instractor.RequestDate).toString().split(" ")[2]

            return (

                <div className="instructorItem ">
                    <div className="listDate ">
                        <div className="date1">
                            <p>{day}</p>
                            <p>{month}</p>
                        </div>
                        <button type="button" className="img btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target={"#card" + index} >
                            <span className="icon text-white-50">
                                <i className="far fa-image"></i>
                            </span>
                        </button>
                        <Modal modalName={"card" + index} body={this.cardIdPic(Instractor._id)} title={Instractor.Email} closeButton="close" />
                    </div>
                    <div className="listData ">
                        <p>Name: {Instractor.Frist_Name} {Instractor.Last_Name}</p>
                        <p>Email: {Instractor.Email}</p>
                        <p>Address: {Instractor.Address}</p>
                        <p>Age: {Instractor.Age}</p>
                    </div>
                    <div className="listButtons ">
                        <button type="button" onClick={() => { this.Accept(Instractor._id) }} className="btn btn-success btn-icon-split btn-sm acceptance" data-toggle="modal" data-target="#exampleModal">
                            <span className="icon text-white-50">
                                <i className="fas fa-check-circle"></i>
                            </span>
                            <span className="text">Accept</span>
                        </button>
                        <button onClick={() => { this.Reject(Instractor._id) }} className="btn btn-danger btn-icon-split btn-sm">
                            <span className="icon text-white-50">
                                <i className="far fa-times-circle"></i>
                            </span>
                            <span className="text">Refuse</span>
                        </button>
                    </div>
                </div>

            )
        })



        return (
            <div className="paddingTop card shadow mb-4" style={{ "margin-top": "70px" }}>
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary requests1">DataTables Example</h6>
                    <button onClick={this.Refresh} className="btn btn-primary btn-icon-split btn-sm requests2" >
                        <span className="icon text-white-50">
                            <i className="fas fa-redo-alt"></i>
                        </span>
                        <span className="text">Refresh</span>
                    </button>
                </div>
                <div className="ListContainer" >
                    {ListInstractors}
                </div>
            </div>
        )
    }
}

export default AdminInstractors;