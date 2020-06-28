import React, { Component } from 'react'
import './style.css'
import { bake_cookie, read_cookie } from 'sfcookies'
import $ from 'jquery'
import loadjs from 'loadjs'
import Modal from '../../components/Modal'
// import '../../custom.js'




class InstructorRequests extends Component {

    state = {
        Requests: [],
        loadjs
    }


    componentDidMount = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : localStorage.getItem('token')},
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/requests/list', requestOptions)
            const data = await api.json();
            this.setState({
                Requests: data
            })

        }
        catch (e) {
            console.log(e);
        }
        console.log("componentDidMount")

        this.setState({
            loadjs: loadjs('js/demo/datatables-requests.js')
        })


    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json' },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/requests', requestOptions)
            const data = await api.json();
            this.setState({
                Requests: data
            })

        }
        catch (e) {
            console.log("no response");
        }


        this.props.history.push("/InstructorProfile")
        this.props.history.push("/InstructorHome/InstructorRequests")


    }


    Vote = async (ID) => {
        console.log(ID)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/domain/vote/' + ID, requestOptions)
            const data = await api.json();


        }
        catch (e) {
            console.log("no response");
        }

        const refresh = () => this.Refresh()
        refresh()
    }


    AddNewDomain = async () => {

    }





    render() {
        console.log("Render")

        const { Requests } = this.state

        const ListRequests = Requests.map((Request, index) => {
            return (
                <tr className="THrequest">
                    <td className="TDrequest" >{Request.Requested_domain}</td>
                    {/* <td>{Request.requester.Email}</td> */}
                    <td>{Request.votes}</td>
                    <td>
                        <button type="button"  onClick={() => { this.Vote(Request.Requested_domain) }} class="btn btn-success btn-icon-split btn-sm " data-toggle="modal" data-target="#exampleModal">
                            <span class="icon text-white-50">
                                <i class="fas fa-vote-yea"></i>
                            </span>
                            {/* <span class="text">vote</span> */}
                        </button>
                    </td>
                </tr>
            )
        })



        return (
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary requests1">DataTables Example</h6>
                    <button onClick={this.Refresh} class="btn btn-primary btn-icon-split btn-sm requests2" >
                        <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span>
                        {/* <span class="text">Refresh</span> */}
                    </button>

                    <button onClick={this.AddNewDomain} class="btn btn-success btn-icon-split btn-sm requests2" >
                        {/* <span class="icon text-white-50">
                            <i class="fas fa-redo-alt"></i>
                        </span> */}
                        <span class="text">Request New Domain</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Domain</th>
                                    {/* <th>Owner</th> */}
                                    <th>Votes</th>
                                    <th>Vote</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ListRequests}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default InstructorRequests;