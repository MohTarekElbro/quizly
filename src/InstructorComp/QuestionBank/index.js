import React, { Component, props } from 'react'
import { bake_cookie, read_cookie } from 'sfcookies'
import filter from 'filter'
import $ from 'jquery'
import loadjs from 'loadjs'
import Modal from '../../components/Modal'
import { withRouter } from 'react-router-dom'
// import '../../custom.js'




class QuestionBank extends Component {

    state = {
        Questions: [],
        loadjs,
        domains: [],
        search: "",
        domainName: "all",
        QuestionType: "all",
        count: 10,
        version: 0,
        bottom: 0,
        height: 0
    }



    componentDidMount = async () => {
        const requestOptions1 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api1;

        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions1)
            let data = await api1.json();
            this.setState({
                domains: data
            })

        }
        catch (e) {
            console.log("no response");
        }
        this.setState({
            loadjs: loadjs('js/demo/datatables-demo1.js')
        })
    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/questionbank/', requestOptions)
            const data = await api.json();
            this.setState({
                Instructors: data
            })

        }
        catch (e) {
            console.log(e);
        }


        this.props.history.push("/instructorProfile")
        this.props.history.push("/instructorHome/questionBank")
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

    findQuestions = async (e) => {
        e.preventDefault()
        var { version } = this.state
        var { count } = this.state
        var { domainName } = this.state
        var { QuestionType } = this.state
        var { search } = this.state
        console.log(domainName, QuestionType)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
            body: JSON.stringify({
                "Domain_Name": domainName,
                "Question_Type": QuestionType,
                "Search": search
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {
            let url = "https://quizly-app.herokuapp.com/questionbank/" + count + "/" + 0;
            console.log(url)
            api = await fetch(url, requestOptions)
            const data = await api.json();
            console.log(api.status)

            if (api.status === 404) {
                this.setState({
                    Questions: []
                })
            }
            else {
                this.setState({
                    Questions: data
                })
                window.addEventListener('scroll', this.handleScroll);
            }


        }
        catch (e) {
            console.log(e);
            this.setState({
                Questions: []
            })
        }
    }

    handleScroll = async (event) => {
        this.setState({
            bottom: document.body.getBoundingClientRect().bottom,
            height: window.innerHeight
        })

        if (this.state.bottom < this.state.height + 1) {
            var { version } = this.state
            var { count } = this.state
            var { domainName } = this.state
            var { QuestionType } = this.state
            var { search } = this.state
            console.log(domainName, QuestionType)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                body: JSON.stringify({
                    "Domain_Name": domainName,
                    "Question_Type": QuestionType,
                    "Search": search
                })
            };
            let api;

            try {
                this.setState({
                    version: version + 1
                })

                var { version } = this.state
                let url = "https://quizly-app.herokuapp.com/questionbank/" + count + "/" + version;
                console.log(url)
                api = await fetch(url, requestOptions)
                const data = await api.json();
                console.log(api.status)

                if (api.status === 404) {
                    this.setState({
                        Questions: []
                    })
                }
                else {
                    this.setState({
                        Questions: this.state.Questions.concat(data)
                    })
                }


            }
            catch (e) {
                console.log(e);
                this.setState({
                    Questions: []
                })
            }
        }
    }



    render() {
        var Types = ["MCQ", "Complete", "T/F"]
        let ListTypes = Types.map((type, index) => {
            return (
                <option key={index} value={type}>{type}</option>
            )
        })

        var { domains } = this.state
        let ListDomains = domains.map((domain, index) => {
            return (
                <option key={index} value={domain.domain_name}>{domain.domain_name}</option>
            )
        })

        let ListQuestions = (
            <div style={{ color: "black" }}>
                Not Found
            </div>
        )
        const { Questions } = this.state
        if (Questions === []) {
            ListQuestions = (
                <div style={{ color: "black" }}>
                    Not Found
                </div>
            )


        }
        else {
            ListQuestions = Questions.map((Question, index) => {

                var disractorsDiv
                if (Question.kind == "MCQ") {
                    disractorsDiv =
                        <div className="QuestionDistractors">
                            <p>Answer: {Question.keyword}</p>
                            <p>dis1: {Question.distructor[0]}</p>
                            <p>dis2: {Question.distructor[1]}</p>
                            <p>dis3: {Question.distructor[2]}</p>
                        </div>
                }
                else if (Question.kind == "Complete") {
                    disractorsDiv =
                        <div className="QuestionDistractors">
                            <p>Answer: {Question.keyword}</p>
                        </div>
                }
                else {
                    disractorsDiv =
                        <div className="QuestionDistractors">
                            <p>Answer: {Question.keyword}</p>
                            <p>dis1: {Question.distructor}</p>
                        </div>
                }
                return (
                    <div className="QuestionItem">
                        <div className="typeAndDomain">
                            <p>Domain: {Question.domain.domain_name}</p>
                            <p>Type: {Question.kind}</p>
                        </div>
                        <div className="line"></div>
                        <div className="questionContent">
                            Question:  {Question.Question}
                        </div>
                        <div className="line"></div>
                        {disractorsDiv}
                    </div>
                )
            })
        }






        return (
            <div class="card shadow mb-4 FindFrom" style={{ "margin-top": "70px" }}>
                <div class="card-header py-3">
                    <form onSubmit={this.findQuestions} className="FindForm">
                        <select data-menu id="QuestionType" className="custom-select" name="QuestionType" value={this.state.QuestionType} onChange={(e) => { this.setState({ QuestionType: e.target.value }) }}>
                            <option value="all">All</option>
                            {ListTypes}
                        </select>

                        <select id="domain" name="domain" className="custom-select" value={this.state.domainName} onChange={(e) => { this.setState({ domainName: e.target.value }) }}>
                            <option value="all">All</option>
                            {ListDomains}

                        </select>

                        <input type="text" class="form-control bg-light border-0 small inputSearch" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.search} onChange={(e) => { this.setState({ search: e.target.value }) }} />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary btn-icon-split btn-sm requests2" >

                                <span class="text">Find</span>
                            </button>

                        </div>
                    </form>
                </div>

                <div className="QuestionsContainer" >

                    {ListQuestions}

                </div>
            </div>
        )
    }
}

export default withRouter(QuestionBank);