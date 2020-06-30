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
import { Default } from 'react-spinners-css';

import GenerteQuestions from '../GenerateQuestions'
import $ from 'jquery'

class InstructorHome extends Component {
    state = {
        token: "loading"
    }
    
    componentWillMount = async() => {

        if (localStorage.getItem("token")) {
            window.addEventListener('scroll', this.handleScroll);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "token": localStorage.getItem("token")
                })
            };
            let api;
            try {
                api = await fetch('https://quizly-app.herokuapp.com/check', requestOptions)
                const data = await api.json();
                if (data.type == "instructor") {
                    this.setState({
                        token:"true"
                    })
                }
                else{
                    this.setState({
                        token:"false"
                    })
                }

            }
            catch (e) {
                
                console.log("Error: ", e);
            }
        }
        else{
            this.setState({
                token:"false"
            })
        }
    }
    

    render() {
        if (this.state.token == "true") {
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
        else if (this.state.token == "false") {
            return (
                <div className="text-center">
                    <div className="error mx-auto" data-text="404">404</div>
                    <p className="lead text-gray-800 mb-5">Page Not Found</p>
                    <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                    <a href="index.html">&larr; Back to Dashboard</a>
                </div>
            )
        }
        else{
            return(
                <div className="loading">
                    <div>
                        {/* <h2>Wait for generating questions...</h2> */}
                        <Default color="#4e73df" />
                    </div>
                </div>
            )
        }
    }
}

export default InstructorHome;