import React from 'react'
import loadjs from 'loadjs'
import { Link, BrowserRouter, withRouter } from 'react-router-dom'
import '../style.css'
import './style.css'
import { Component } from 'react'
import { read_cookie } from 'sfcookies'
import { createHashHistory } from 'history'
class AmdinFeatuers extends Component {

    state = {
        domains: [],
        Questions: [],
        FeatuersWidth : 0
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
            console.log("no response");
        }
    }

    navigate = async (domainID) => {
        const history = createHashHistory()
        this.props.history.push("/adminHome")
        this.props.history.push({
            pathname: "/adminHome/questionBank",
            state: {
                Domain: domainID
            }
        });


    }


    render() {
        const { domains } = this.state

        const questionsFeatures = domains.map((domain, index) => {
            return (
                <div key={index}>
                    
                    <a class="collapse-item pointer"  onClick={() => { this.navigate(domain.domain_name) }} >
                        {/* <i class="fas fa-fw fa-cog"></i> */}
                        <span>{domain.domain_name}</span>
                    </a>
                    {/* <div id={"domain" + index} class="collapse" aria-labelledby="headingTwo" data-parent={"#" + index}>
                        <div class="bg-white py-2 collapse-inner rounded">
                            <a onClick={() => this.navigate("MCQ", domain._id)} class="collapse-item pointer"  >MCQ</a>
                            <a onClick={() => this.navigate("T/F", domain._id)} class="collapse-item pointer" >TrueOrFalse</a>
                            <a onClick={() => this.navigate("Complete", domain._id)} class="collapse-item pointer"  >complete</a>
                            <a onClick={() => this.navigate("all", domain._id)} class="collapse-item pointer"  >All</a>
                        </div>
                    </div> */}
                </div>
            )
        })



        return (
            <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar" >

                <a class="sidebar-brand d-flex align-items-center justify-content-center" href="">
                    <div class="sidebar-brand-icon rotate-n-15">
                        <i class="fas fa-laugh-wink"></i>
                    </div>
                    <div class="sidebar-brand-text mx-3">Quizly Admin </div>
                </a>

                <li class="nav-item active">
                    <a class="nav-link" >
                        <i class="fas fa-fw fa-tachometer-alt"></i>
                        <span> Dashboard</span></a>
                </li>

                <hr class="sidebar-divider" />

                <div class="sidebar-heading">
                    Features
                </div>

                <li class="nav-item">
                <Link class="nav-link collapsed" to={{
                        pathname: "/adminHome/questionBank",
                        state: {
                            url:"https://quizly-app.herokuapp.com/admin/questionbank/"
                        }
                    }}  >
                        <i class="fas fa-fw fa-cog"></i>
                        <span>Question Bank</span>
                    </Link>
                    {/* <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div class="bg-white py-2 collapse-inner rounded">
                            <h6 class="collapse-header">Domains List:</h6>

                            {questionsFeatures}
                            <a onClick={() => { this.navigate("all", "all") }} class="collapse-item" >All</a>


                        </div>
                    </div> */}
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/adminHome/adminFeedback" >
                        <i className="fas fa-comments"></i>
                        <span>Feedback</span>
                    </Link>
                </li>

                <hr class="sidebar-divider" />

                <div class="text-center d-none d-md-inline">
                    <button class="rounded-circle border-0" id="sidebarToggle"></button>
                </div>

                <div className="fixed">{this.state.bottom} <p>{this.state.height}</p></div>




            </ul>
        )
    }
}

export default withRouter(AmdinFeatuers);

