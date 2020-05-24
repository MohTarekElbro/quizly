import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import loadjs from 'loadjs'
import './style.css'
import socketIOClient from "socket.io-client";

import { read_cookie } from 'sfcookies'


class InstructorFeedback extends Component {


    state = {
        pageContent: "",
        Feedbacks: [],
        loadjs,
        bottom: 0,
        height: 0,
        count: 10,
        version: 0,
        deletedID: false,
        addedFeedback: "",
        socket: ""
    }

    componentDidUpdate = async () => {
        let deletedIndex = -1;
        let newFeedbacks = this.state.Feedbacks
        newFeedbacks.map((feedback, index) => {
            if (feedback._id == this.state.deletedID) {
                deletedIndex = index
            }
        })
        if (deletedIndex != -1) {
            newFeedbacks.splice(deletedIndex, 1)
            this.setState({
                Feedbacks: newFeedbacks
            })
            const { Feedbacks } = this.state
            this.setState({
                pageContent: this.listFeedbacks(Feedbacks)
            })

        }

    }
    componentDidMount = async () => {
        this.setState({
            socket: socketIOClient("https://quizly-app.herokuapp.com")
        })
        var { count } = this.state
        window.addEventListener('scroll', this.handleScroll);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "instructor": read_cookie('instructorID')
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/set/feedbacks/' + count + '/0', requestOptions)
            const data = await api.json();
            this.setState({
                Feedbacks: data
            })
        }
        catch (e) {
            console.log("Error: ", e);
        }
        console.log("componentDidMount")

        loadjs('js/demo/datatables-demo1.js')

        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.listFeedbacks(Feedbacks)
        })
        console.log("page content: " ,this.state.pageContent)


    }

    listFeedbacks = (FeedBacks) => {
        if (FeedBacks[0] == null) {
            return (
                <div style={{ "width": "100%", "display": "flex", "justifyContent": "center" }}>
                    <div class="text-center" >
                        <div class="error mx-auto" data-text="404">404</div>
                        <p class="lead text-gray-800 mb-5">Page Not Found</p>
                        <p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                        <a href="index.html">&larr; Back to Dashboard</a>
                    </div>
                </div>
            )
        }
        else {
            return FeedBacks.map((Feedback, index) => {
                var month = new Date(Feedback.date).toString().split(" ")[1]
                var day = new Date(Feedback.date).toString().split(" ")[2]

                return (
                    <div className="instructorItem ">
                        <div className="listDate ">
                            <div className="date1">
                                <p>{day}</p>
                                <p>{month}</p>
                            </div>

                        </div>
                        <div className="listData ">
                            <p className="center">Email: {Feedback.creator.Email} </p>
                            <p>Feedback: {Feedback.feedback} </p>
                        </div>
                        <div className="listButtons ">

                            <button onClick={() => { this.delete(Feedback._id) }} className="btn btn-danger btn-icon-split btn-sm">
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
    delete = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },

        };
        let api;


        try {
            api = await fetch('https://quizly-app.herokuapp.com/delete/feedback/' + id, requestOptions)
            console.log("API: ", api)
            this.setState({
                deletedID: id
            })
        }
        catch (e) {
            console.log("Error: ", e);
        }
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
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
                body: JSON.stringify({
                    "instructor": read_cookie("instructorID")
                })
            };
            let api;


            try {
                this.setState({
                    version: version + 1
                })

                var { version } = this.state
                console.log('https://quizly-app.herokuapp.com/set/feedbacks/' + count + '/' + version)
                api = await fetch('https://quizly-app.herokuapp.com/set/feedbacks/' + count + '/' + version, requestOptions)
                const data = await api.json();
                console.log(data)
                this.setState({
                    Feedbacks: this.state.Feedbacks.concat(data)
                })

            }
            catch (e) {
                console.log("no response");
            }
            const { Feedbacks } = this.state
            this.setState({
                pageContent: this.listFeedbacks(Feedbacks)
            })
        }
    }

    Refresh = async () => {
        var { count } = this.state
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "instructor": read_cookie('instructorID')
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/set/feedbacks/' + count + '/0', requestOptions)
            const data = await api.json();
            this.setState({
                Feedbacks: data
            })
        }
        catch (e) {
            console.log("Error: ", e);
            this.setState({
                Feedbacks: []
            })
            const { Feedbacks } = this.state
            this.setState({
                pageContent: this.listFeedbacks(Feedbacks)
            })
        }
        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.listFeedbacks(Feedbacks)
        })

        window.addEventListener('scroll', this.handleScroll);

    }

    addFeedback = async (e) => {
        e.preventDefault()
        var { addedFeedback } = this.state
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "feedback": addedFeedback
            })
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/feedback/write', requestOptions)
            const data = await api.json();
            console.log("added successfully: ", data)
            this.state.socket.emit("AddRequest")
            this.Refresh()

        }
        catch (e) {
            console.log("Error: ", e);
        }
        
    }

    NewFeedback = () => {
        return (
            <div class="flex row" >
                <div class="form-container  ">
                    <h2>Feedback</h2>
                    <p style={{ "margin-bottom": "10px" }}>
                        Please provide your feedback below:
                    </p>
                    <form role="form" method="post" id="reused_form" onSubmit={this.addFeedback}>
                        <div class="row">
                            <div class="col-sm-12 form-group">
                                <label style={{ "margin-bottom": "15px" }}>How do you rate your overall experience?</label>
                                <p>
                                    <label class="margin radio-inline">
                                        <input type="radio" name="experience" id="radio_experience" value="bad" />
                                        Bad
                                    </label>

                                    <label class="margin radio-inline">
                                        <input type="radio" name="experience" id="radio_experience" value="average" />
                                        Average
                                    </label>

                                    <label class="margin radio-inline">
                                        <input type="radio" name="experience" id="radio_experience" value="good" />
                                        Good
                                    </label>
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 form-group">
                                <label for="comments">
                                    Comments:</label>
                                <textarea class="form-control" type="textarea" name="comments" id="comments" placeholder="Your Comments" maxLength="6000" rows="7" onBlur={(e) => { console.log(this.state.addedFeedback); this.setState({ addedFeedback: e.target.value }) }} ></textarea>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12 form-group">
                                <input type="submit" class="btn btn-lg btn-warning btn-block" value="Post" /> 
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        )
    }

    showNewFeedback = () => {
        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.NewFeedback()
        })
        window.removeEventListener('scroll', this.handleScroll);
    }
    render() {
        const { Feedbacks } = this.state
        const { pageContent } = this.state

        const ListFeedbacks = Feedbacks.map((Feedback, index) => {
            var month = new Date(Feedback.date).toString().split(" ")[1]
            var day = new Date(Feedback.date).toString().split(" ")[2]

            return (
                <div className="instructorItem ">
                    <div className="listDate ">
                        <div className="date1">
                            <p>{day}</p>
                            <p>{month}</p>
                        </div>

                    </div>
                    <div className="listData ">
                        <p className="center">Email: {Feedback.creator.Email} </p>
                        <p>Feedback: {Feedback.feedback} </p>
                    </div>
                    <div className="listButtons ">

                        <button onClick={() => { this.delete(Feedback._id) }} className="btn btn-danger btn-icon-split btn-sm">
                            <span className="icon text-white-50">
                                <i className="far fa-times-circle"></i>
                            </span>
                            <span className="text">Delete</span>
                        </button>
                    </div>
                </div>

            )
        })
        return (
            <div className="paddingTop card shadow mb-4" style={{ "margin-top": "70px" }}>
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary requests1">Your FeedBacks</h6>
                    <button onClick={this.Refresh} className="btn btn-primary btn-icon-split btn-sm requests2" >
                        <span className="icon text-white-50">
                            <i className="fas fa-redo-alt"></i>
                        </span>
                        <span className="text">Refresh</span>
                    </button>
                    <button onClick={this.showNewFeedback} className="btn btn-success btn-icon-split btn-sm requests2" >
                        <span className="icon text-white-50">
                            <i class="fas fa-plus-square"></i>
                        </span>
                        <span className="text">New FeedBack</span>
                    </button>
                </div>
                <div className="ListContainer" >
                    {pageContent}
                </div>
            </div>
        )
    }
}

export default InstructorFeedback;