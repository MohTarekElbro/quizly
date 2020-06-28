import React, { Component } from 'react'
import AdminNav from '../AdminNav'
import { Route } from 'react-router-dom'
import AmdinFeatuers from '../AdminFeatuers'
import AdminProfile from '../AdminProfile'
import AdminInstractors from '../AdminInstractors'
import { read_cookie } from 'sfcookies'
import QuestionBank from '../../components/Questions'
import AdminFeedback from '../AdminFeedback'

class AdminHome extends Component {
    componentWillMount() {
        const token = localStorage.getItem("token")
        this.setState({
            token
        })
    }
    state = {
        token: ""
    }



    render() {
        if (this.state.token.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
            return (
                <div id="wrapper"  >
                    <AmdinFeatuers />
                    <div id="content-wrapper" class="d-flex flex-column">
                        <div id="content">
                            <AdminNav />
                            <div class="container-fluid">
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
        else {
            return (
                <div class="text-center">
                    <div class="error mx-auto" data-text="404">404</div>
                    <p class="lead text-gray-800 mb-5">Page Not Found</p>
                    <p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
                    <a href="index.html">&larr; Back to Dashboard</a>
                </div>
            )
        }
    }
}

export default AdminHome;