import React, { Component } from 'react'
import { bake_cookie, read_cookie } from 'sfcookies'
import loadjs from 'loadjs'

class AdminFeedback extends Component {
    state = {
        pageContent: "",
        Feedbacks: [],
        loadjs,
        bottom: 0,
        height: 0,
        count: 10,
        version: 0,
        emailFeedbacks: ""
    }

    componentDidMount = async () => {
        var { count } = this.state
        var { emailFeedbacks } = this.state
        console.log("email: ", emailFeedbacks)
        window.addEventListener('scroll', this.handleScroll);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "Email": emailFeedbacks
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/set/feedbacks/' + count + '/0', requestOptions)
            const data = await api.json();
            this.setState({
                Feedbacks: data
            })
        }
        catch (e) {
            console.log("Error: ", e);
        }
        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.listFeedbacks(Feedbacks)
        })
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
                        <div className="listData " >
                            <p className="center">Email: {Feedback.creator.Email} </p>
                            <p>Feedback: {Feedback.feedback} </p>
                        </div>
                        
                    </div>
                )
            })
        }
    }

    handleScroll = async (event) => {

        var { count } = this.state
        var { version } = this.state
        var { emailFeedbacks } = this.state
        this.setState({
            bottom: document.body.getBoundingClientRect().bottom,
            height: window.innerHeight
        })

        if (this.state.bottom < this.state.height + 1) {
            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
                body: JSON.stringify({
                    "Email": emailFeedbacks
                })
            };
            let api;


            try {
                this.setState({
                    version: version + 1
                })

                var { version } = this.state
                console.log('https://quizly-app.herokuapp.com/admin/set/feedbacks/' + count + '/' + version)
                api = await fetch('https://quizly-app.herokuapp.com/admin/set/feedbacks/' + count + '/' + version, requestOptions)
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
        var { emailFeedbacks } = this.state
        window.addEventListener('scroll', this.handleScroll);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "Email": emailFeedbacks
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/set/feedbacks/' + count + '/0', requestOptions)
            const data = await api.json();
            this.setState({
                Feedbacks: data
            })
        }
        catch (e) {
            console.log("Error: ", e);
        }
        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.listFeedbacks(Feedbacks)
        })
    }

    findFeedbacks = async (e) => {
        e.preventDefault()
        var { count } = this.state
        var { emailFeedbacks } = this.state
        console.log("emailFeedbacks: " , emailFeedbacks)
        window.addEventListener('scroll', this.handleScroll);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "Email": emailFeedbacks
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/set/feedbacks/' + count + '/0', requestOptions)
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
        }
        const { Feedbacks } = this.state
        this.setState({
            pageContent: this.listFeedbacks(Feedbacks)
        })
    }

    render() {
        const { pageContent } = this.state
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
                    <form onSubmit={this.findFeedbacks} className="FindForm">
                        <input type="text" className="form-control bg-light  small inputSearch" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.emailFeedbacks} onChange={(e) => { this.setState({ emailFeedbacks: e.target.value }) }} />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-primary btn-icon-split btn-sm requests2" >

                                <span className="text">Find</span>
                            </button>

                        </div>
                    </form>
                </div>
                <div className="ListContainer" >
                    {pageContent}
                </div>
            </div>
        )
    }



}

export default AdminFeedback