import React, { Component } from 'react'
import InstructorNav from '../InstructorNav'
import { Route } from 'react-router-dom'
import InstructorFeatuers from '../InstructorFeatuers'
import InstructorProfile from '../InstructorProfile'
import { read_cookie } from 'sfcookies'
import QuestionBank from '../../components/Questions'
import InstructorRequests from '../InstructorRequests'
import InstructorFeedback from '../InstructorFeedback'
import AddingQuestion from '../AddingQuestion'
import GenerateExam from '../GenerateExam'
import Exams from '../Exams'
import GenerteQuestions from '../GenerateQuestions'
import $ from 'jquery'

class InstructorHome extends Component {
    componentWillMount() {
        const token = localStorage.getItem("token")
        this.setState({
            token
        })
    }
    componentDidMount = () => {
        $(window).animate({ scrollTop: 0 }, 1)
        this.props.history.push("/instructorHome/generateExam")
    }
    state = {
        token: ""
    }

    render() {
        if (this.state.token.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
            return (
                <div id="wrapper">
                    <InstructorFeatuers />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <InstructorNav />
                            <div className="container-fluid">
                                <Route path='/instructorHome/generateQuestions' component={GenerteQuestions} />
                                <Route path='/instructorHome/Exams' component={Exams} />
                                <Route path='/instructorHome/addingQuestion' component={AddingQuestion} />
                                <Route path='/instructorHome/instructorProfile' component={InstructorProfile} />
                                <Route path='/instructorHome/questionBank' component={QuestionBank} />
                                <Route path='/instructorHome/myQuestions' component={QuestionBank} />
                                <Route path='/instructorHome/instructorRequests' component={InstructorRequests} />
                                <Route path='/instructorHome/instructorFeedback' component={InstructorFeedback} />
                                <Route path='/instructorHome/generateExam' component={GenerateExam} />


                            </div>
                        </div>

                    </div>

                </div>
            )
        }
        else {
            return (
                <div className="text-center">
                    <div className="error mx-auto" data-text="404">404</div>
                    <p className="lead text-gray-800 mb-5">Page Not Found</p>
                    <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                    <a href="index.html">&larr; Back to Dashboard</a>
                </div>
            )
        }
    }
}

export default InstructorHome;