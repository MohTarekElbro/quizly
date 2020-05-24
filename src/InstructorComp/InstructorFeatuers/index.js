import React from 'react'
import loadjs from 'loadjs'
import { Link, BrowserRouter, withRouter } from 'react-router-dom'
import { Component } from 'react'
import { read_cookie } from 'sfcookies'
import { createHashHistory } from 'history'
class InstructorFeatuers extends Component {

    state = {
        domains: [],
        Questions: []
    }

    componentDidMount = async () => {

        loadjs('js/sb-admin-2.js')
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions)
            const data = await api.json();
            this.setState({
                domains: data
            })

        }
        catch (e) {
            console.log(e);
        }
    }

    navigate = async (QuestionType, domainID) => {
        console.log(domainID)
        let flag = true
        const newdata = []
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/questionbank/' + domainID, requestOptions)
            const data = await api.json();
            if (QuestionType !== "all") {
                flag = false
                console.log("NotAll")
                data.map(d => {
                    if (d.kind == QuestionType) {
                        newdata.push(d)
                    }
                })
                this.setState({
                    Questions: newdata
                })
            }

            if (flag) {
                this.setState({
                    Questions: data
                })

            }

        }
        catch (e) {
            console.log(e);
            this.setState({
                Questions: newdata
            })
        }

        const history = createHashHistory()
        this.props.history.push("/instructorHome")
        this.props.history.push({
            pathname: "/instructorHome/questionBank",
            state: {
                Questions: this.state.Questions
            }
        });


    }

    render() {
        const { domains } = this.state





        return (
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar" >

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">Quizly Instructor </div>
                </a>

                <li className="nav-item active">
                    <a className="nav-link" >
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span> Dashboard</span></a>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Features
                </div>



                <li className="nav-item">
                    <Link className="nav-link collapsed" to={{
                        pathname: "/instructorHome/questionBank",
                        state: {
                            url: "https://quizly-app.herokuapp.com/questionbank/"
                        }
                    }}  >
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Question Bank</span>
                    </Link>
                    {/* <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Domains List:</h6>

                            {questionsFeatures}
                            <a onClick={() => { this.navigate("all", "all") }} className="collapse-item" >All</a>


                        </div>
                    </div> */}
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to={{
                        pathname: "/instructorHome/generateExam",

                    }}>
                        <i class="fas fa-graduation-cap"></i>
                        <span>Generate Exam</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/instructorHome/generateQuestions" >
                        <i class="fas fa-question-circle"></i>
                        <span>GenerateQuestions</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to={{
                        pathname: "/instructorHome/Exams",

                    }}>
                        <i class="fas fa-graduation-cap"></i>
                        <span>My Exams</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-wrench"></i>
                        <span>Domains</span>
                    </a>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Domain's Types</h6>
                            <a className="collapse-item pointer" >Existed Domains</a>
                            <Link className="collapse-item" to="/instructorHome/instructorRequests">Requested Domains</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/instructorHome/instructorFeedback" >
                        <i className="fas fa-comments"></i>
                        <span>Feedback</span>
                    </Link>

                </li>


                <hr className="sidebar-divider" />

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </div>




            </ul>
        )
    }
}

export default withRouter(InstructorFeatuers);

