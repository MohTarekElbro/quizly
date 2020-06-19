import React, { Component } from 'react'
import './style.css'
import { read_cookie } from 'sfcookies'
import $ from 'jquery'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'
import { confirm } from 'jquery-confirm'

class AddingQuestion extends Component {

    state = {
        QuestionType: "mcq",
        public: "false",
        numOfDis: 1,
        distractorsValue: [],
        state: 'true',
        level: "medium",
        domains: [],
        DomainName: "SW",
        keyword: "",
        Question: "",


    }


    componentDidMount = async () => {

        const requestOptions1 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
            console.log(e);
        }
    }

    completeForm = () => {
        return (
            <form id="reused_form" onSubmit={this.addQuestion}>
                <div className="levels">
                    <input type="text" className="form-control bg-light  small inputSearch" style={{ "marginBottom": "20px" }} placeholder="The Answer"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.keyword} onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                </div>

                <div class="row">
                    <div class="col-sm-12 form-group">
                        <input type="submit" class=" btn-secondary btn btn-lg  btn-block" value="Post" />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////MCQ Functions////////////////////////////////

    addNewDistractor = (i) => {
        i = i - 1
        this.setState({
            numOfDis: this.state.numOfDis + 1
        })
        var { numOfDis } = this.state
    }

    removeDistractor = (i) => {
        console.log("RemoveID: ", i)
        this.setState({
            numOfDis: this.state.numOfDis - 1
        })
        var { distractorsValue } = this.state
        distractorsValue.splice(i, 1)
        this.setState({
            distractorsValue
        })
    }

    distractor = (i) => {
        var { numOfDis } = this.state
        let span;
        let a;
        if (i != 0) {
            span = (
                <span onClick={() => this.removeDistractor(i)} className="remove pointer">
                    <i class="fas fa-times-circle"></i>
                </span>
            )
        }
        if ((i + 1) == numOfDis) {
            a = <a id={"dis" + i} onClick={() => this.addNewDistractor(i + 1)} className="addQuestions btn btn-secondary btn-icon-split btn-sm " >
                <span className="icon text-white-50">
                    <i class="fas fa-plus-square"></i>
                </span>
            </a>
        }


        return (
            <div className="disDiv" id={"disDiv" + i} style={{ "marginBottom": "20px" }}>
                <input id={"disInput" + i} type="text" autoFocus className="form-control bg-light  small inputSearch" onFocus={(e) => { e.target.select() }} placeholder="Add New Distractor"
                    aria-label="Search" aria-describedby="basic-addon2" value={this.state.distractorsValue[i]} onChange={(e) => {
                        let { distractorsValue } = this.state
                        distractorsValue[i] = e.target.value
                        this.setState({
                            distractorsValue
                        })

                    }} />
                {a}
                {span}

            </div>
        )
    }

    mcqForm = () => {
        var { numOfDis } = this.state
        var distractorsList = []
        for (let i = 0; i < numOfDis; i++) {

            distractorsList.push(this.distractor(i))
        }
        return (
            <form id="reused_form" onSubmit={this.addQuestion}>
                <div className="levels">
                    <input type="text" className="form-control bg-light  small inputSearch" style={{ "marginBottom": "20px" }} placeholder="The Answer"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.keyword} onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                </div>

                <p style={{ "margin-bottom": "20px", "textAlign": "center" }}>
                    You dont have to add all distractors!
                </p>

                <div className="distractors">
                    {distractorsList}

                </div>
                <div class="row">
                    <div class="col-sm-12 form-group">
                        <input type="submit" class=" btn-success btn btn-lg btn-block" value="Post" />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////MCQ Functions////////////////////////////////
    //////////////////////////TrueOrFalse////////////////////////////////

    statechange = () => {
        $("#state1").toggleClass("btn-secondary").toggleClass('btn-light')
        $("#state2").toggleClass("btn-secondary").toggleClass('btn-light')
        if (this.state.state == true) {
            this.setState({
                state: false
            })
        }
        else {
            this.setState({
                state: true
            })
        }
    }

    TrueOrFalseForm = () => {
        return (
            <form id="reused_form" onSubmit={this.addQuestion}>
                <div class="col-sm-12 form-group levels">
                    <p>
                        <label class="margin radio-inline">
                            <input type="radio" name="state" id="state" onChange={(e) => this.setState({ state: e.target.value })} value="true" />
                            True
                        </label>

                        <label class="margin radio-inline">
                            <input type="radio" name="state" id="state" onChange={(e) => this.setState({ state: e.target.value })} value="false" />
                            False
                        </label>
                    </p>
                </div>
                <div className="distractors">
                    <input type="text" className="form-control bg-light  small " style={{ "marginBottom": "20px" }} placeholder="Keyword"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.keyword} onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                    <input type="text" className="form-control bg-light  small " style={{ "marginBottom": "20px" }} placeholder="Distractor"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.distractorsValue[0]} onChange={(e) => {
                            let { distractorsValue } = this.state
                            distractorsValue[0] = e.target.value
                            this.setState({
                                distractorsValue
                            })

                        }} />
                </div>


                <div class="row">
                    <div class="col-sm-12 form-group">
                        <input type="submit" class=" btn-secondary btn btn-lg  btn-block" value="Post" />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////TrueOrFalse////////////////////////////////
    //////////////////////////Public Finctions////////////////////////////////

    formContent = () => {
        var { QuestionType } = this.state
        if (QuestionType == "mcq") {
            return this.mcqForm()
        }
        else if (QuestionType == "complete") {
            return this.completeForm()
        }
        else {
            return this.TrueOrFalseForm()
        }
    }

    changeForm = (e) => {
        this.setState({
            QuestionType: e.target.value
        })
    }

    addPublic = (e) => {
        this.setState({
            public: e.target.value
        })

    }

    selectLevel = (e) => {
        this.setState({
            level: e.target.value
        })
    }

    addQuestion = async (e) => {
        e.preventDefault()
        var { level } = this.state
        var { Question } = this.state
        var { keyword } = this.state
        var { state } = this.state
        let Publication = this.state.public
        var { distractorsValue } = this.state
        var { DomainName } = this.state
        var { QuestionType } = this.state
        console.log(DomainName)
        if (Question == "") {
            $.alert({
                title: 'Error!',
                content: 'Enter the Question!',
                buttons: {
                    okay: function () { },

                }
            });
        }
        else if (keyword == "") {
            $.alert({
                title: 'Error!',
                content: 'Enter the answer!',
                buttons: {
                    okay: function () { },
                }
            });
        }
        else if (distractorsValue.length < 1 && QuestionType != "complete") {
            $.alert({
                title: 'Error!',
                content: 'Enter at least one Distractor',
                buttons: {
                    okay: function () { },
                }
            });
        }

        else {
            const requestOptions1 = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
                body: JSON.stringify({
                    "Level": level,
                    "Question": Question,
                    "keyword": keyword,
                    "state": state,
                    "public": Publication,
                    "add_distructors": distractorsValue,
                    "domain_name": DomainName
                })
            };
            let api1;

            try {
                api1 = await fetch('https://quizly-app.herokuapp.com/question/add/' + QuestionType, requestOptions1)
                let data = await api1.json();
                console.log(api1.status)
                if (api1.status == 302) {
                    $.confirm({
                        title: 'Confirm!',
                        boxWidth: '40%',
                        useBootstrap: false,
                        content: data.massage + " , do you want to add private in your collection?",
                        buttons: {
                            confirm: async () => {
                                const requestOptions1 = {
                                    method: 'Post',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
                                    body: JSON.stringify({
                                        "Level": level,
                                        "Question": Question,
                                        "keyword": keyword,
                                        "state": state,
                                        "add_distructors": distractorsValue,
                                        "domain_name": DomainName
                                    })
                                };

                                let api = await fetch('https://quizly-app.herokuapp.com/question/addRepeated/' + QuestionType, requestOptions1)
                                let data = await api.json();
                                console.log(data)
                            },
                            cancel: function () { },
                        }
                    });


                }
                else if (api1.status == 301) {
                    $.alert({
                        title: 'Error!',
                        boxWidth: '400px',
                        useBootstrap: false,
                        content: data.massage,
                        buttons: {
                            okay: function () { },
                        }
                    });
                }
                else if (api1.status == 201) {
                    let distrators = []
                    data.distructor.forEach(element => {
                        distrators.push(element.distructor)
                    });
                    data.distructor = distrators
                    data.owner = data.owner._id
                    console.log("dissssssssssssssssssssssss: ", data)
                    if (this.props.getQuestion) {
                        this.props.getQuestion(data)
                    }
                    $.alert({
                        title: 'Success!',
                        boxWidth: '400px',
                        useBootstrap: false,
                        content: "Question Added",
                        buttons: {
                            okay: function () { },
                        }
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    //////////////////////////Public Finctions////////////////////////////////

    render() {
        let formContent = this.formContent()
        let Publication = this.state.public

        var { domains } = this.state
        let ListDomains = domains.map((domain, index) => {
            return (
                <option key={index} value={domain.domain_name}>{domain.domain_name}</option>
            )
        })
        return (
            <div class="flex row" style={{ "margin": "20px 0px 30px" }}>
                <div class="form-container">
                    <h2 className="center">Add Question</h2>
                    <div class="row">
                        <div class="col-sm-12 form-group levels">
                            <p>

                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id="QuestionType" onChange={this.changeForm} value="mcq" />
                                    MCQ
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id="QuestionType" onChange={this.changeForm} value="trueorfalse" />
                                    TrueOrFalse
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id="QuestionType" onChange={this.changeForm} value="complete" />
                                    Complate
                                </label>
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 form-group levels">
                            <p>
                                <label class="margin radio-inline">
                                    <input type="radio" name="public" id="public" onChange={this.addPublic} value="false" />
                                    Private
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="public" id="public" onChange={this.addPublic} value="true" />
                                    Public
                                </label>
                            </p>
                        </div>
                    </div>
                    <div className="row levels">
                        <span style={{ "margin": "auto 0", "height": "30px" }}>Domain: </span>
                        <select data-menu id="QuestionType" className="select1" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                            {ListDomains}

                        </select >
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group levels">
                            <p>
                                <label class="margin radio-inline">
                                    <input type="radio" name="level" id="level" onChange={this.selectLevel} value="easy" />
                                    easy
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="level" id="level" onChange={this.selectLevel} value="medium" />
                                    medium
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="level" id="level" onChange={this.selectLevel} value="hard" />
                                    hard
                                </label>
                            </p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group">
                            <textarea class="addQuestionText" type="textarea" name="comments" id="comments" placeholder="Your Question" maxLength="6000" rows="7" onBlur={(e) => { console.log(this.state.Question); this.setState({ Question: e.target.value }) }} ></textarea>
                        </div>
                    </div>

                    {formContent}

                </div>
            </div>
        )
    }
}

export default AddingQuestion;