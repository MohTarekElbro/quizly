import React, { Component } from 'react'
import AdminNav from '../AdminNav'
import { Route } from 'react-router-dom'
import AmdinFeatuers from '../AdminFeatuers'
import AdminProfile from '../AdminProfile'
import AdminInstractors from '../AdminInstractors'
import { read_cookie } from 'sfcookies'
import QuestionBank from '../../components/Questions'
import AdminFeedback from '../AdminFeedback'
import { Default } from 'react-spinners-css';
import AdminDomains from '../AdminDomains'


class AdminHome extends Component {

    state = {
        token: "loading"
    }
    componentWillMount = async () => {

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
                if (data.type == "admin") {
                    this.setState({
                        token: "true"
                    })
                }
                else {
                    this.setState({
                        token: "false"
                    })
                }

            }
            catch (e) {

                console.log("Error: ", e);
            }
        }
        else {
            this.setState({
                token: "false"
            })
        }
    }



    render() {
        if (this.state.token == "true") {
            return (
                <div id="wrapper"  >
                    <AmdinFeatuers />
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id="content">
                            <AdminNav />
                            <div class="container-fluid">
                                <Route path='/adminHome/adminDomains' component={AdminDomains} />
                                <Route path='/adminHome/adminFeedback' component={AdminFeedback} />
                                <Route path='/adminHome/adminProfile' component={AdminProfile} />
                                <Route path='/adminHome/adminInstractors' component={AdminInstractors} />
                                <Route path='/adminHome/questionBank' component={QuestionBank} />

                            </div>
                        </div>



                        <footer class="sticky-footer bg-white">
                            <div class="container my-auto">
                                <div class="copyright text-center my-auto">
                                    <span>Copyright &copy; Your Website 2019</span>
                                </div>
                            </div>
                        </footer>

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
                </div>
            )
        }
        else {
            return (
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

export default AdminHome;