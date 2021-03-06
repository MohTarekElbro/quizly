import React, { Component, props, DropdownButton, Dropdown, Fragment } from 'react'
import _, { throttle } from 'lodash'
import { DropdownList } from 'react-widgets'
import { bake_cookie, read_cookie } from 'sfcookies'
import filter from 'filter'
import $ from 'jquery'
import loadjs from 'loadjs'
import './style.css'
import './jquery.js'
import Modal from '../../components/Modal'
import { withRouter } from 'react-router-dom'
import { Ring } from 'react-spinners-css';
import AddingQuestion from '../../InstructorComp/AddingQuestion'
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
        height: 0,
        commingUrl: "",
        flag: true,
        helperheight: 100000,
        deletedQuestions: [],
        different: '',
        EditQuestionModal: (<div></div>)
        // EditModal:(<Modal index={0} modalName={"card"} body={<AddingQuestion editRenderdQuestion={this.editRenderdQuestion} Question={""} index={0} url={"https://quizly-app.herokuapp.com/question/edit/"} />} title={"Edit Question"} closeButton="close" />)

    }
    componentDidUpdate = () => {
        if (this.props.url) {
            $('.QuestionItem').css({
                "display": "block",
                "flex-basis": "100%",
                "margin-left": "0",
                "margin-right": "0",
                'cursor': 'pointer'
            })
            $('.TypeAndDomain').css({
                "flex-flow": "column",
                "align-items": "center"
            })

        }
        if (this.props.url) {
            // console.log("PropsVersion: ", this.props.backQuestion, "StateVersion: ", this.state.different)
            if (this.props.backQuestion && this.props.backQuestion.different !== this.state.different) {
                // console.log("Doneeeeeeeeeeeeeeeeeeeeeeeeee")
                // console.log("backQuestion: ", this.props.backQuestion)
                var { Questions } = this.state
                // console.log("oldQuestions: ", Questions)
                if ((this.props.pageType == "questionBank" && this.props.backQuestion.public == true) || ((this.props.pageType == "myQuestions" || this.props.pageType == "addingNewQuestion") && this.props.backQuestion.owner == localStorage.getItem("instructorID"))) {
                    Questions.push(this.props.backQuestion)
                    this.setState({
                        Questions,
                        different: this.props.backQuestion.different
                    })
                }
                let index
                var { deletedQuestions } = this.state
                for (let i = 0; i < deletedQuestions.length; i++) {
                    if (this.props.backQuestion._id == deletedQuestions[i]._id) {
                        index = i
                        break
                    }
                }
                deletedQuestions.splice(index, 1)
                this.setState({
                    deletedQuestions,
                    different: this.props.backQuestion.different
                })
            }
            if (this.state.commingUrl != this.props.url) {
                this.setState({
                    Questions: [],
                    loadjs,
                    search: "",
                    domainName: "all",
                    QuestionType: "all",
                    count: 10,
                    version: 0,
                    bottom: 0,
                    height: 0,
                    commingUrl: this.props.url,
                    flag: true,
                    helperheight: 100000
                })
            }
        }
        else {
            if (this.state.commingUrl != this.props.location.state.url) {

                this.setState({
                    Questions: [],
                    loadjs,
                    search: "",
                    domainName: "all",
                    QuestionType: "all",
                    count: 10,
                    version: 0,
                    bottom: 0,
                    height: 0,
                    commingUrl: this.props.location.state.url
                })
            }
        }
    }







    componentDidMount = async () => {
        $('.FindFrom').animate({ scrollTop: 0 }, 1)
        if (this.props.url) {
            this.setState({
                commingUrl: this.props.url
            })
            var { deletedQuestions } = this.props
            this.setState({

            })
        }
        else {
            this.setState({
                commingUrl: this.props.location.state.url
            })
        }
        const requestOptions1 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api1;

        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/domain', requestOptions1)
            let data = await api1.json();
            console.log("DATAAAAAAAAAaa@@: " , data)
            this.setState({
                domains: data
            })

        }
        catch (e) {
            // console.log("no response");
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
            api = await fetch('https://quizly-app.herokuapp.com/admin/questionbank/', requestOptions)
            const data = await api.json();
            this.setState({
                Instractors: data
            })

        }
        catch (e) {
            // console.log("no response");
        }


        this.props.history.push("/adminProfile")
        this.props.history.push("/adminHome/questionBank")
    }

    findQuestions = async (e) => {
        $(".QuestionsContainer").css("padding-bottom", "40px")
        $(".questionsLoading").removeClass("remove")
        $('#QuestionsBody1').animate({ scrollTop: 0 }, 1)
        let helper = false
        this.setState({
            flag: true
        })
        var version
        try {
            e.preventDefault()

            this.setState({
                version: 0,
                Questions: []
            })
            version = 0
            // console.log("version: ", version)
        }
        catch (err) {
            version = e
            helper = true
            this.setState({
                version
            })
        }


        var { count } = this.state
        var { domainName } = this.state
        var { QuestionType } = this.state
        var { search } = this.state
        // console.log(domainName, QuestionType)
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
            // console.log("ABO ELVARASION: ", version)

            let url1
            if (this.props.url) {
                url1 = this.props.url
            }
            else {
                url1 = this.props.location.state.url
            }
            let url = url1 + count + "/" + version;
            // console.log(url)
            api = await fetch(url, requestOptions)
            const data = await api.json();
            // console.log(api.status)

            if (api.status === 404) {
                this.setState({
                    Questions: []
                })
                $(".QuestionsContainer").css("padding-bottom", "30px")
                $(".questionsLoading").addClass("remove")
            }
            else {
                // console.log("Data: ", data)
                let dataLength = data.length
                if (data.length == 0) {
                    console.log("NODATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    this.setState({
                        version: 0
                    })

                }
                else {
                    if (helper) {
                        let Questions = this.state.Questions
                        Questions.forEach(deleted => {
                            // console.log("Questions.length: " , Questions.length)
                            for (let i = 0; i < data.length; i++) {
                                if (deleted._id == data[i]._id) {
                                    // console.log("data.length: ", data.length)
                                    // console.log("I: ", i)
                                    data.splice(i, 1)
                                    i--
                                    // console.log("I: ", i)
                                    // console.log("deleted: " , data[i+1].Question)
                                    break
                                }
                                // else {
                                //     j++
                                // }
                            }
                            // if (j < 10) {
                            //     console.log("Repeated: " , j)
                            //     this.handleScroll(j)
                            //     j=10
                            // }
                            // console.log("api.status: ", api.status)
                        });
                        this.setState({
                            Questions: this.state.Questions.concat(data),
                            version: 1
                        })
                    }
                    else {
                        this.setState({
                            Questions: data,
                            version: 1
                        })
                    }
                }
                if (this.props.url) {
                    this.filterQuestions()
                }
                // if (this.state.Questions.length < 4) {
                //     console.log("SCROLLHANDLED")
                //     this.handleScroll()
                // }
                // console.log(this.state.Questions.length, " ", dataLength)
                if (this.state.Questions.length < 1 && this.props.url && dataLength != 0) {
                    $(".QuestionsContainer").css("padding-bottom", "40px")
                    $(".questionsLoading").removeClass("remove")
                    var value = ((this.state.deletedQuestions.length) / this.state.count)
                    if (value > parseInt(value)) {
                        value = parseInt(value)
                    }
                    var version = 0
                    try {
                        e.preventDefault()
                        // console.log("first Time")
                    }
                    catch (error) {
                        // console.log("Not first Time: ", e)
                        version = e
                    }
                    version = version + 1


                    // console.log("Findversion1: ", version)
                    // let version1 = version + parseInt(value)
                    // console.log("Findversion2: ", version1)
                    // this.setState({
                    //     version: version 
                    // })
                    // console.log("Findversionnnnnn: ", version-1)
                    this.findQuestions(version)

                }
                else {
                    $(".QuestionsContainer").css("padding-bottom", "30px")
                    $(".questionsLoading").addClass("remove")
                }
                // if (this.state.Questions.length == 0) {
                //     var value = ((this.state.deletedQuestions.length) / this.state.count)
                //     if (value > parseInt(value)) {
                //         value = parseInt(value) + 1
                //     }
                //     if (e == value) {

                //     }
                //     else {
                //         var { version } = this.state
                // console.log("version: ", version)
                //         version = version + parseInt(value)
                // console.log("version: ", version)
                //         this.setState({
                //             version
                //         })
                //         this.findQuestions(value)
                //     }
                // }
                // $(".QuestionsContainer").css("padding-bottom", "40px")
                // $(".questionsLoading").removeClass("remove")
                this.QuestionsBody1.addEventListener('scroll', _.throttle(this.handleScroll, 700));
                // $(".QuestionsContainer").css("padding-bottom", "30px")
                // $(".questionsLoading").addClass("remove")
            }


        }
        catch (e) {
            // console.log(e);
            this.setState({
                Questions: []
            })
            $(".QuestionsContainer").css("padding-bottom", "30px")
            $(".questionsLoading").addClass("remove")
        }
    }

    throttle(fn, wait) {

        var time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                // console.log("POOOP")
                fn();
                time = Date.now();
            }
            else {
                // console.log("time + wait - Date.now()",)
                throttle(fn, time + wait - Date.now())
            }
        }
    }

    handleScroll = async (event) => {

        this.setState({
            bottom: document.body.getBoundingClientRect().bottom,
            height: window.innerHeight
        })
        var obj = $('#QuestionsBody1').scrollTop()
        // console.log(obj + 450, "height: ", $('#QuestionsBody').height())

        // console.log("height2: ", this.state.helperheight)

        if (obj + 550 > $('#QuestionsBody').height() && this.state.flag == true) {
            // console.log("FLAG: ", this.state.flag)
            this.setState({
                flag: false
            })
            this.setState({ helperheight: $('#QuestionsBody').height() })
            // console.log("done")
            var { version } = this.state
            var { count } = this.state
            var { domainName } = this.state
            var { QuestionType } = this.state
            var { search } = this.state
            // console.log(version, this.state.Questions[0])
            if (version == 0 || this.state.Questions[0] == null) {

            }
            else {
                // console.log("VERSIONSSSSSSSSSSSSSSSSSSSSSSSS: ", this.state.version)
                $(".QuestionsContainer").css("padding-bottom", "40px")
                $(".questionsLoading").removeClass("remove")
                $('#QuestionsBody1').animate({ scrollTop: $('#QuestionsBody').height() + 40 }, 1)

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

                    let url1
                    if (this.props.url) {
                        url1 = this.props.url
                    }
                    else {
                        url1 = this.props.location.state.url
                    }
                    var { version } = this.state
                    // console.log("VERSIONS@: ", version)
                    let url = url1 + count + "/" + version;
                    // console.log(url)
                    api = await fetch(url, requestOptions)
                    var data = await api.json();
                    this.setState({
                        version: version + 1
                    })
                    if (data.length == 0) {
                        this.setState({
                            version: 0
                        })
                    }
                    else {
                        if (this.props.url) {
                            let jj = 0
                            // console.log("event: " , event)
                            // if(parseInt(event)){

                            //     jj=event
                            // }
                            // for (let j = jj, v = 1; j < 10;) {
                            var { Questions } = this.state
                            let dataLength = data.length
                            console.log(data)
                            Questions.forEach(deleted => {
                                // console.log("Questions.length: " , Questions.length)
                                for (let i = 0; i < data.length; i++) {
                                    if (deleted._id == data[i]._id) {
                                        // console.log("data.length: ", data.length)
                                        // console.log("I: ", i)
                                        data.splice(i, 1)
                                        i--
                                        // console.log("I: ", i)
                                        // console.log("deleted: " , data[i+1].Question)
                                        break
                                    }
                                    // else {
                                    //     j++
                                    // }
                                }
                                // if (j < 10) {
                                //     console.log("Repeated: " , j)
                                //     this.handleScroll(j)
                                //     j=10
                                // }
                                // console.log("api.status: ", api.status)
                            });

                            // }
                        }
                        // console.log("api.status: ", api.status)

                        if (api.status === 404) {
                            // this.setState({
                            //     Questions: []
                            // })

                        }
                        else {
                            this.setState({
                                Questions: this.state.Questions.concat(data)
                            })
                            $(".QuestionsContainer").css("padding-bottom", "30px")
                            $(".questionsLoading").addClass("remove")
                        }
                    }
                    $(".questionsLoading").addClass("remove")
                    $(".QuestionsContainer").css("padding-bottom", "30px")


                }
                catch (e) {
                    // console.log(e);
                    this.setState({
                        Questions: [],
                        version: 0
                    })
                }
            }
            this.setState({
                flag: true
            })
        }
    }

    filterQuestions = () => {
        var { deletedQuestions } = this.state
        var { Questions } = this.state
        deletedQuestions.forEach(deleted => {
            for (let i = 0; i < Questions.length; i++) {
                if (deleted._id == Questions[i]._id) {
                    Questions.splice(i, 1)
                }
            }
        });
        var { deletedQuestions } = this.props
        // console.log(deletedQuestions)
        deletedQuestions.forEach(deleted => {
            for (let i = 0; i < Questions.length; i++) {
                if (deleted._id == Questions[i]._id) {
                    Questions.splice(i, 1)
                }
            }
        });

        this.setState({
            Questions
        })
    }

    filterRenderQuestions = (Questions) => {
        var { deletedQuestions } = this.state
        deletedQuestions.forEach(deleted => {
            for (let i = 0; i < Questions.length; i++) {
                if (deleted._id == Questions[i]._id) {
                    Questions.splice(i, 1)
                }
            }
        });
        var { deletedQuestions } = this.props
        // console.log(deletedQuestions)
        deletedQuestions.forEach(deleted => {
            for (let i = 0; i < Questions.length; i++) {
                if (deleted._id == Questions[i]._id) {
                    Questions.splice(i, 1)
                }
            }
        });


    }

    sendQuestion = (Question) => {
        if (this.props.url) {
            var { Questions } = this.state
            var { deletedQuestions } = this.state
            let index
            for (let i = 0; i < Questions.length; i++) {
                if (Question._id == Questions[i]._id) {
                    index = i
                    deletedQuestions.push(Questions[i])

                    break
                }
            }
            Questions.splice(index, 1)
            this.setState({
                Questions
            })

            this.setState({
                deletedQuestions
            })
            if (this.props.getItem) {
                this.props.getItem(Question)
            }
        }
        // console.log("this.state.Questions.length: ", this.state.Questions.length)
        if (this.state.Questions.length < 2) {
            var value = ((this.state.deletedQuestions.length) / this.state.count)
            if (value > parseInt(value)) {
                value = parseInt(value) + 1
            }
            let realVersion = this.state.version
            // console.log("realVersion: ", realVersion)
            var version = 0
            // console.log("version1: ", version)
            version = version + parseInt(value)
            // console.log("version2: ", version)
            this.setState({
                version: version + 1
            })
            // console.log("versionnnnnn: ", version)
            this.findQuestions(version)
        }
    }

    editRenderdQuestion = (Question, newOrNot = false) => {
        var { Questions } = this.state
        if (newOrNot == true) {
            console.log(Questions)
            Questions.push(Question)
        }
        else {
            for (let i = 0; i < Questions.length; i++) {
                if (Question._id == Questions[i]._id) {
                    Questions[i] = Question
                }
            }
        }
        console.log("Questions: ", Questions)
        this.setState({
            Questions
        })
    }

    deleteQeustion = async (id) => {
        $.confirm({
            title: 'Confirm!',
            boxWidth: '40%',
            useBootstrap: false,
            content: "Are you sure you want to delete this question?",
            buttons: {
                confirm: async () => {
                    const requestOptions1 = {
                        method: 'delete',
                        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                    };
                    let api1;

                    try {
                        api1 = await fetch('https://quizly-app.herokuapp.com/Question/delete/' + id, requestOptions1)
                        let data = await api1.json();
                        console.log(api1.status, " ", data)
                        if (api1.status == 303) {
                            $.alert({
                                title: 'Error!',
                                boxWidth: '400px',
                                content: data.massage+"s",
                                buttons: {
                                    okay: function () { },
                
                                }
                            });
                        }
                        else {
                            var { Questions } = this.state

                            for (let i = 0; i < Questions.length; i++) {
                                if (id == Questions[i]._id) {
                                    Questions.splice(i, 1)
                                }
                            }
                            this.setState({
                                Questions
                            })
                        }

                    }
                    catch (e) {
                        console.log(e);
                    }
                },
                cancel: function () { },
            }
        });






    }
    editModalFun = (index, Question) => {
        let { EditQuestionModal } = this.state
        EditQuestionModal = (<AddingQuestion editRenderdQuestion={this.editRenderdQuestion} random={Math.random()} Question={Question} index={index + 1} url={"https://quizly-app.herokuapp.com/question/edit/" + Question._id} />)
        this.setState({
            EditQuestionModal
        })
        console.log("MODAL EDITED");

    }

    render() {
        var editAndDelete = (
            <Fragment></Fragment>
        )
        // var EditModal = this.state.EditModal
        var title = (<Fragment></Fragment>)
        if (this.props.location.state) {
            if (this.props.location.state.pageType == "questionBank") {
                title = (<h2 className="titleee"><p>Question Bank</p></h2>)
            }
            else {
                title = (<h2 className="titleee"><p>My Questions</p></h2>)
            }
        }


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
        var { Questions } = this.state
        if (this.props.url) {
            this.filterRenderQuestions(Questions)
        }
        Questions = Questions.sort((a, b) => new Date(b.time) - new Date(a.time))
        if (Questions === []) {
            ListQuestions = (
                <div style={{ color: "black" }}>
                    Not Found
                </div>
            )


        }
        else {
            ListQuestions = Questions.map((Question, index) => {
                if (this.props.location.state) {
                    if (this.props.location.state.url.includes("getmyQuestions")) {

                        editAndDelete = (
                            <Fragment>
                                <button onClick={() => this.editModalFun(index, Question)} data-toggle="modal" data-target={"#card"} type="button" className="editQuestion"><i class="fas fa-edit"></i><p className="editHover">Edit Question</p> </button>

                                <button onClick={() => this.deleteQeustion(Question._id)} className="deleteQuestion" ><i class="far fa-trash-alt"></i><p className="deleteHover">Delete Question</p></button>
                            </Fragment>
                        )
                    }

                }
                // if (this.props.url) {
                //     if (this.props.url.includes("getmyQuestions")) {
                //         editAndDelete = (
                //             <Fragment>
                //                 <button data-toggle="modal" data-target={"#card" + index + 1} type="button" className="editQuestion"><i class="fas fa-edit"></i><p className="editHover">Edit Question</p> </button>
                //                 <Modal index={index + 1} modalName={"card" + index + 1} body={<AddingQuestion editRenderdQuestion={this.editRenderdQuestion} Question={Question} index={index + 1} url={"https://quizly-app.herokuapp.com/question/edit/" + Question._id} />} title={"Edit Question"} closeButton="close" />
                //                 <button className="deleteQuestion" ><i class="far fa-trash-alt"></i><p className="deleteHover">Delete Question</p></button>
                //             </Fragment>
                //         )
                //     }
                // }
                // console.log(Question)
                let QuestionPublication;
                if (Question.public == false) {
                    QuestionPublication = (<span className="privateQuestion"><span><i class="fas fa-lock"></i> Private Question</span></span>)
                }
                else {
                    QuestionPublication = (<span className="publicQuestion"><span><i class="fas fa-unlock-alt"></i> Public Question</span></span>)
                }
                var disractorsDiv
                if (Question.kind == "MCQ") {
                    let distractorItem = Question.distructor.map((dis, index) => {
                        return (
                            <p>dis{index + 1}:  {dis}</p>
                        )
                    })
                    disractorsDiv =
                        <div className="QuestionDistractors">
                            <p>Answer: {Question.keyword}</p>
                            {distractorItem}
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
                    <div key={index} className="QuestionItem" onClick={() => this.sendQuestion(Question)} >
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
                        <div className="line" style={{ 'marginTop': "15px", 'marginBottom': '15px' }}></div>
                        {QuestionPublication}

                        {editAndDelete}



                    </div>

                )
            })
        }


        return (
            <div className="card shadow mb-4 FindFrom" >
                <div className="card-header py-3">
                    {title}
                    <form onSubmit={this.findQuestions} className="FindForm">
                        <select data-menu id="QuestionType" className="custom-select" name="QuestionType" value={this.state.QuestionType} onChange={(e) => { this.setState({ QuestionType: e.target.value }) }}>
                            <option value="all">All types</option>
                            {ListTypes}
                        </select>

                        <select id="domain" name="domain" className="custom-select" value={this.state.domainName} onChange={(e) => { this.setState({ domainName: e.target.value }) }}>
                            <option value="all">All domains</option>
                            {ListDomains}

                        </select>

                        <input type="text" className="form-control bg-light  small inputSearch" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.search} onChange={(e) => { this.setState({ search: e.target.value }) }} />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-primary btn-icon-split btn-sm requests2" >
                                <span className="text">Search</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="QuestionsContainer1" id="QuestionsBody1" ref={(QuestionsBody1) => { this.QuestionsBody1 = QuestionsBody1 }}>
                    <div className="QuestionsContainer" id="QuestionsBody" ref={(QuestionsBody) => { this.QuestionsBody = QuestionsBody }}>

                        {ListQuestions}
                        <Modal modalName={"card"} body={this.state.EditQuestionModal} title={"Edit Question"} closeButton="close" />
                        <div className="questionsLoading remove">
                            <div>
                                <Ring color="#4e73df" style={{ "width": "20px", "height": "20px" }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuestionBank);