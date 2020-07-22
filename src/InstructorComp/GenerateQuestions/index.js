import React, { Component, Fragment } from 'react'
import './style.css'
import { read_cookie, bake_cookie } from 'sfcookies';
import { Default } from 'react-spinners-css';
import { Ouroboro } from 'react-spinners-css';
import { Ring } from 'react-spinners-css';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import socketIOClient from "socket.io-client";
import $ from 'jquery'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'
import { confirm } from 'jquery-confirm'
import ReactToPdf from 'react-to-pdf'

import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Modal from '../../components/Modal';
import AddingQuestion from '../AddingQuestion';

// value={this.state.search} onChange={(e) => { this.setState({ search: e.target.value }) }}
class GenerteQuestions extends Component {
    state = {
        QuestionType: "MCQ",
        public: "false",
        numOfDis: 1,
        distractorsValue: [],
        state: 'true',
        level: "M",
        text: "",
        domains: [],
        numOfAnswers: 2,
        filePath: "",
        DomainName: "SW",
        keyword: "",
        Questions: "",
        screen: "loading1",
        fileName: "",

        publics: [],
        levels: [],

        selectedAll: false,
        EditQuestionModal: (<div></div>)

    }

    componentWillMount = () => {
        // $('#generateButton').css({
        //     "opacity": "0.5",
        //     "cursor": "not-allowed"
        // })
        // $('#generateButton').prop('disabled', 'true')
        this.getQuestions()
    }



    componentDidMount = async () => {

        $(".selectdiv").css({
            "background-color": "white",
            "color": "#4E73DF"
        })
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
            console.log(e);
        }

        const socket = socketIOClient("https://quizly-app.herokuapp.com")
        socket.on('sendQuestions', () => {
            this.getQuestions(false)
            this.setState({
                screen: "generatedQuestions"
            })
        })

        if (this.props.generateQuestions) {
            console.log($(".levels"))
            $(".levels").css("width", "100%")
        }
    }


    getQuestions = async (flag = true) => {

        const requestOptions1 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api1;

        try {

            api1 = await fetch('https://quizly-app.herokuapp.com/instructor/GetMyRequest', requestOptions1)
            console.log(api1)
            if (api1.status == 400) {
                this.setState({
                    screen: "generateQuestion"
                })
                console.log("noRequest")
            }
            else {
                const requestOptions = {
                    method: 'Get',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                };
                let api;

                try {

                    api = await fetch('https://quizly-app.herokuapp.com/instructor/GetTempQuestions', requestOptions1)
                    let data = await api.json()
                    if (api.status == 404) {

                    }
                    else {

                        data["allowedQuestions"] = {}
                        Object.keys(data.Questions).forEach(question => {
                            data["allowedQuestions"][question] = "unSelected"
                        });

                        this.setState({
                            Questions: data,
                            screen: "generatedQuestions"
                        })
                        let { Questions } = this.state
                        let Questions1 = Questions.Questions
                        // console.log("PRIVTEESSS: ", data.Questions)
                        let keys = Object.keys(data.Questions)
                        let { publics } = this.state
                        let { levels } = this.state
                        for (let i = 0; i < keys.length; i++) {
                            // console.log("PULICSSSSSSSSS")
                            publics.push(false)
                            levels.push("medium")
                        }
                        this.setState({
                            publics,
                            levels
                        })
                        if (flag) {
                            $.alert({
                                title: 'UnSaved',
                                boxWidth: "600px",
                                content: 'These questions should be saved before generating new ones',
                                buttons: {
                                    okay: function () { },

                                }
                            });
                        }
                        // console.log("Questions arrived: ", data)
                    }
                }
                catch (e) {
                    console.log(e)
                    this.setState({
                        screen: "loading"
                    })
                    console.log("no Questions yet")
                }
            }


        }
        catch (e) {
            console.log(e);
        }
    }

    uploadImage = async (e) => {
        let file = this.txtFile.files[0]
        // console.log(file.name)
        if (file) {
            if (file.name.includes(".txt")) {
                this.setState({
                    fileName: <div style={{ "position": "absolute", "right": "60%", "top": "-15px" }}>
                        <Ring size="30" color="black" />
                    </div>
                })
                $('.saveImg').css('display', 'block')
                let formData = new FormData()
                formData.append('resource', file)
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Authorization': localStorage.getItem("token") },
                    body: formData
                };
                let api;

                try {
                    api = await fetch('https://quizly-app.herokuapp.com/upload/resources', requestOptions)
                    let data = await api.json();
                    // console.log(data.path)

                    this.setState({
                        filePath: data.path,
                        fileName: file.name
                    })
                }
                catch (e) {
                    console.log(e.message);
                }
            }
            else {
                $.alert({
                    title: 'Error!',
                    content: 'You must upload "txt" file',
                    buttons: {
                        okay: function () { },

                    }
                });
            }
        }

    }

    saveFile = async () => {
        let file = this.txtFile.files[0]
        console.log(file)
        let formData = new FormData()
        formData.append('resource', file)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': localStorage.getItem("token") },
            body: formData
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/upload/resources', requestOptions)
            let data = await api.json();
            console.log(data.path)
            this.setState({
                filePath: data.path
            })

        }
        catch (e) {
            console.log(e.message);
        }
    }

    generateQuestions = async () => {
        let { QuestionType } = this.state
        let { level } = this.state
        let { DomainName } = this.state
        let { numOfAnswers } = this.state
        let { filePath } = this.state
        let { text } = this.state
        if ((filePath != null && filePath != "") || text != "") {
            let requestOptions = {}
            if (text != "") {
                console.log("TEXT BABE")
                requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                    body: JSON.stringify({
                        "data": text,
                        "Diffculty": level,
                        "Distructor": numOfAnswers
                    })
                };
            }
            else {
                requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                    body: JSON.stringify({
                        "path": filePath,
                        "Diffculty": level,
                        "Distructor": numOfAnswers
                    })
                };
            }

            this.setState({
                screen: "loading"
            })
            let api;

            try {
                api = await fetch('https://quizly-app.herokuapp.com/GenerateQuestion/' + DomainName + '/' + QuestionType, requestOptions)
                let data = await api.json();
                console.log(data)
                if (data.body == "in Processing") {
                    $("#generateButton").css("display", "block")
                    if (DomainName == "PL") {
                        this.setState({
                            QuestionType: "Complete"
                        })
                    }


                    this.setState({
                        screen: "loading",
                        filePath: ""
                    })
                    $('#generateButton').css({
                        "opacity": "0.5",
                        "cursor": "not-allowed"
                    })
                    $('#generateButton').prop('disabled', 'true')
                }

            }
            catch (e) {
                this.setState({
                    renderScreen: "generateQuestion"
                })

                console.log(e.message);

            }
        } else {
            $.alert({
                title: 'Error!',
                content: "You must upload file or write a generation text",
                buttons: {
                    okay: function () { },

                }
            });
        }
    }

    saveQuestions = async () => {
        let QuestionsPackge = this.state.Questions
        // console.log("QuestionsPackge : ", QuestionsPackge)
        let Questions = QuestionsPackge.Questions
        let { QuestionType } = this.state
        let { level } = this.state


        let { levels } = this.state
        let savedQuestions = []
        let kinds = []
        let keywords = []
        let states = []
        let { publics } = this.state
        let add_distructors = {}
        let { DomainName } = this.state
        let numofQuestions = 0
        console.log(Object.keys(Questions).length)
        for (let i = 0, k = 0; i < Object.keys(Questions).length; i++) {
            if (QuestionsPackge["allowedQuestions"][i] == "unSelected") {
                console.log("unSelected")
                continue
            }
            numofQuestions++
            // if (level == "H") {
            //     levels.push("hard")
            // }
            // else {
            //     levels.push("medium")
            // }
            if (QuestionsPackge.kind == "Complete") {
                savedQuestions.push(Questions[i][0])
            }
            else if (QuestionsPackge.kind == "MCQ") {
                savedQuestions.push(Questions[i][Questions[i].length - 1])
            }
            else {
                savedQuestions.push(Questions[i][3])
            }

            if (QuestionsPackge.kind == "MCQ") {
                kinds.push("mcq")
            }
            else if (QuestionsPackge.kind == "Complete") {
                kinds.push("complete")
            }
            else {
                kinds.push("trueorfalse")
            }



            if (QuestionsPackge.kind == "Complete") {
                keywords.push(Questions[i][1])
            }
            else {
                keywords.push(Questions[i][0])
            }

            if (QuestionsPackge.kind == "trueorfalse") {
                if (Questions[i][2] == "T") {
                    states[k.toString()] = "true"
                }
                else {
                    states[k.toString()] = "false"
                }
            }

            // publics.push("false")

            if (QuestionsPackge.kind == "MCQ") {
                add_distructors[k.toString()] = []
                for (let j = 1; j < Questions[i].length - 1; j++) {
                    add_distructors[k.toString()].push(Questions[i][j])
                }
            }
            else if (QuestionsPackge.kind == "trueorfalse") {
                add_distructors[k.toString()] = []
                add_distructors[k.toString()].push(Questions[i][1])
            }

            k++
        }

        // console.log(levels)
        console.log(savedQuestions)
        // console.log(kinds)
        console.log(keywords)
        // 
        console.log(add_distructors)
        console.log(states)

        $.confirm({
            title: 'Confirm!',
            boxWidth: $(window).width() < 800 ? '80%' : '50%',
            useBootstrap: false,
            content: numofQuestions > 0 ? "Are you sure to save the selected questions??" : "You did not select any question , are you sure that you want to unsave all questions?",
            buttons: {
                confirm: async () => {
                    if (numofQuestions == 0) {
                        const requestOptions = {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                        };
                        let api;

                        try {
                            api = await fetch('https://quizly-app.herokuapp.com/instructor/DeleteAllRequest', requestOptions)
                            this.setState({
                                screen: "generateQuestion"

                            })
                            $('#generateButton').css({
                                "opacity": "0.5",
                                "cursor": "not-allowed"
                            })
                            $('#generateButton').prop('disabled', 'true')

                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    }
                    else {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                            body: JSON.stringify({
                                "Level": levels,
                                "Question": savedQuestions,
                                "kind": kinds,
                                "state": states,
                                "keyword": keywords,
                                "public": publics,
                                "add_distructors": add_distructors,
                                "domain_name": DomainName
                            })
                        };
                        let api;

                        try {
                            api = await fetch('https://quizly-app.herokuapp.com/instructor/AddQuestion', requestOptions)
                            let data = await api.json();
                            console.log("SavedQuestions: ", data)
                            this.setState({
                                screen: "generateQuestion"

                            })
                            $('#generateButton').css({
                                "opacity": "0.5",
                                "cursor": "not-allowed"
                            })
                            $('#generateButton').prop('disabled', 'true')

                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    }
                    this.setState({
                        Questions: []
                    })
                },
                cancel: function () { },
            }
        });


    }

    selectQuestion = (question) => {
        let { Questions } = this.state
        let Questions1 = Questions.allowedQuestions[question]
        console.log("Questions1: ", Questions1)
        if (Questions1 == "unSelected") {
            Questions.allowedQuestions[question] = "selected"
            this.setState({
                Questions
            })
            $("#" + question).addClass("selected")
            $("#" + question).addClass("clicked")
        }

        else {
            Questions.allowedQuestions[question] = "unSelected"
            this.setState({
                Questions
            })
            $("#" + question).removeClass("selected")
            $("#" + question).removeClass("clicked")
        }


    }

    selectAll = (type) => {
        let { Questions } = this.state
        let Questions1 = Questions.allowedQuestions
        if (type == "selectAll") {
            if (this.state.selectedAll == false) {
                Object.keys(Questions.allowedQuestions).forEach(question => {
                    Questions.allowedQuestions[question] = "selected"
                });

                $(".generatedItem").addClass("selected")
                $(".selectdiv").css({
                    "background-color": "#4E73DF",
                    "color": "white"
                })
                this.setState({
                    selectedAll: true
                })
            }
            else {
                Object.keys(Questions.allowedQuestions).forEach(question => {
                    if (Questions.allowedQuestions[question] == "selected" && $("#" + question).hasClass('clicked') == false) {
                        Questions.allowedQuestions[question] = "unSelected"
                    }
                    if ($("#" + question).hasClass('clicked')) {
                        console.log("CLICKED: ", question)
                    }
                    else {
                        $("#" + question).removeClass("selected")
                    }
                });
                $(".selectdiv").css({
                    "background-color": "white",
                    "color": "#4E73DF"
                })
                this.setState({
                    selectedAll: false
                })
                // $(".generatedItem").removeClass("selected")
            }
        }
        else {
            $.confirm({
                title: 'Confirm!',
                boxWidth: $(window).width() < 800 ? '80%' : '50%',
                useBootstrap: false,
                content: "Are you sure you want to unselect all questions even protected?",
                buttons: {
                    confirm: () => {
                        Object.keys(Questions.allowedQuestions).forEach(question => {
                            if (Questions.allowedQuestions[question] == "selected") {
                                // console.log("REMOVE ALL")
                                Questions.allowedQuestions[question] = "unSelected"
                                $("#" + question).removeClass("selected")
                                $("#" + question).removeClass("clicked")
                            }
                        });
                        $(".selectdiv").css({
                            "background-color": "white",
                            "color": "#4E73DF"
                        })
                        this.setState({
                            selectedAll: false
                        })
                    },
                    cancel: function () { },
                }
            });
        }
        this.setState({
            Questions
        })
    }

    changeState = (Question, state) => {
        if (state == "true") {
            console.log(Question)
        }
    }



    editModalFun = (index, Question) => {
        let { Questions } = this.state
        let { EditQuestionModal } = this.state
        console.log(Question)
        EditQuestionModal = (<AddingQuestion Level={"medium"} domain={Questions.domain} QuestionType={Questions.kind} editRenderdQuestion={this.editRenderdQuestion} random={Math.random()} tempQuestion={Question} index={index} />)
        this.setState({
            EditQuestionModal
        })
        // console.log("MODAL EDITED");

    }
    editRenderdQuestion = (index, Question, keyword, distractors = [], publication, level, state = false) => {
        let { Questions } = this.state
        let { publics } = this.state
        let { levels } = this.state
        let realQuestions = Questions.Questions
        console.log("realQuestions: ", realQuestions[index], state)
        if (Questions.kind == "MCQ") {
            realQuestions[index][0] = keyword
            realQuestions[index][realQuestions[index].length - 1] = Question
            for (let i = 1; i < realQuestions[index].length - 1; i++) {
                realQuestions[index][i] = distractors[i - 1]
            }

        }
        else if (Questions.kind == "trueorfalse") {
            realQuestions[index][0] = keyword
            realQuestions[index][3] = Question
            realQuestions[index][1] = distractors[0]
            if (state == false) {
                realQuestions[index][2] = "F"
            }
            else {
                realQuestions[index][2] = "T"
            }
        }
        else {
            realQuestions[index][0] = Question
            realQuestions[index][1] = keyword
        }
        console.log("realQuestions2: ", realQuestions[index])
        publics[parseInt(index)] = publication
        levels[parseInt(index)] = level
        // console.log("realQuestions2: ", levels)
        this.setState({
            publics,
            levels,
            Questions
        })
    }


    renderScreen = () => {
        // console.log("this.state.QuestionType: ", this.state.QuestionType)
        let { screen } = this.state
        if (screen == "generateQuestion") {
            var { domains } = this.state
            let ListDomains = domains.map((domain, index) => {
                return (
                    <option key={index} value={domain.domain_name}>{domain.domain_name}</option>
                )
            })
            return (
                <div class="flex row" style={{ "margin": "20px 0px 30px" }}>
                    <div class="generate-form  ">
                        <h2 className="center">Generate Questions</h2>
                        <div className="selects">
                            <div className=" levels" style={this.props.generateQuestions ? { "width": "100%" } : {}}>
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Type of Questions: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.QuestionType} onChange={(e) => { this.setState({ QuestionType: e.target.value }) }} >
                                    <option value={"MCQ"}>MCQ</option>
                                    <option value={"trueorfalse"}>TrueOrFalse</option>
                                    <option value={"Complete"}>Complete</option>
                                </select >
                            </div>

                            <div className=" levels" style={this.props.generateQuestions ? { "width": "100%" } : {}}>
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Domain: </span>
                                <select data-menu id="QuestionType" className="select1" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                                    {ListDomains}
                                </select >
                            </div>



                            <div className=" levels" style={this.state.QuestionType == "MCQ" ? this.props.generateQuestions ? { "width": "100%" } : {} : { 'display': "none" }}>
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Num of Answers: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.numOfAnswers} onChange={(e) => { this.setState({ numOfAnswers: e.target.value }) }} >
                                    <option value={2}>{2}</option>
                                    <option value={3}>{3}</option>
                                    <option value={4}>{4}</option>
                                    <option value={5}>{5}</option>
                                </select >
                            </div>

                            <div className=" levels" style={this.state.QuestionType == "MCQ" ? this.props.generateQuestions ? { "width": "100%" } : {} : { 'display': "none" }} >
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Level of Questions: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.level} onChange={(e) => { this.setState({ level: e.target.value }) }} >
                                    <option value={"H"}>Hard</option>
                                    <option value={"M"}>Medium</option>
                                </select >
                            </div>
                        </div>

                        <div className="options">
                            <p onClick={() => this.changeOption("uploadInput")} style={{
                                'font-weight': 'bold',
                                "text-decoration": "underline",
                                'font-size': '17px'
                            }} className="option" id="uploadInputItem" >Upload Txt file</p>
                            <div className="line"></div>
                            <p onClick={() => this.changeOption("textarea")} className="option" id="textareaItem">Wirte in Text</p>



                        </div>


                        <div class="row optionItem remove" id="textarea" >
                            <div class="col-sm-12 form-group">
                                <textarea class="generateQuestionText" ref={(textarea) => { this.textarea = textarea }} type="text" name="comments" id="comments" placeholder="Your Question" rows="7" value={this.state.text} onChange={(e) => { this.setState({ text: e.target.value }) }} ></textarea>

                            </div>
                        </div>

                        <div className="uploadTxtFile  optionItem" id="uploadInput">
                            <label className="uploadFile" style={{ "marginTop": "0px" }}>
                                <input type="file" name='txtFile' ref={(txtFile) => { this.txtFile = txtFile }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                                <i className="fas fa-upload"></i> Upload Txt File
                            </label>

                            <p className="" style={{ "position": "relative" }} > {this.state.fileName}</p>
                        </div>

                        <div className="generateQuestionsButton">
                            <button onClick={() => this.generateQuestions()} type="submit" id="generateButton" className="btn btn-primary btn-icon-split btn-md generateButton " >
                                <span className="text">Generate</span>
                            </button>
                        </div>


                    </div>
                </div>
            )
        }
        else if (screen == "loading") {
            return (
                <div className="loading">
                    <div>
                        <h2>Wait for generating questions...</h2>
                        <Ouroboro color="#be97e8" />
                    </div>
                </div>
            )
        }
        else if (screen == "loading1") {
            return (
                <div className="loading">
                    <div>
                        <Default color="#4e73df" />
                    </div>
                </div>
            )
        }
        else if (screen == "generatedQuestions") {
            let genetatedContStyle = {
                "width": "100%",
                "margin-left": "0%",
                "margin-right": "0%",
                "margin-bottom": "0px"
            }

            let h3Style = {
                "font-size": "20px",
                "margin": "auto 0",
            }

            let itemStyle = {
                "width": "98%",
                "margin-left": "1%",
                "margin-right": "1%",
            }
            let { Questions } = this.state
            let { QuestionType } = this.state
            // console.log("QuestionType: ", QuestionType)
            let Questions1 = Questions.Questions


            if (Questions != "") {
                let ListQuestions = Object.keys(Questions1).map((Question, index) => {
                    let distractorItem = [];
                    if (Questions.kind == "Complete") {
                        distractorItem.push(<p>Answer:  {Questions1[Question][1]}</p>)

                        let disractorsDiv =
                            <div className="QuestionDistractors">
                                {distractorItem}
                            </div>
                        return (
                            <Fragment>
                                <div onClick={() => this.editModalFun(Question, Questions1[Question])} data-toggle="modal" data-target={"#generatedCard"} type="button" className="editQuestion"><i class="fas fa-edit"></i><p className="editHover">Edit Question</p> </div>

                                <div style={this.props.generateQuestions ? itemStyle : {}} id={Question} key={Question} onClick={() => this.selectQuestion(Question)} className="generatedItem" >

                                    <div className="generatedContent">
                                        Question:  {Questions1[Question][0]}
                                    </div>
                                    <div className="line"></div>
                                    {disractorsDiv}
                                    <div className="line proline" style={{ 'marginTop': "15px", 'marginBottom': '15px' }}></div>
                                    <span className="protected"><span><i class="fas fa-lock"></i> Protected</span></span>
                                </div>
                            </Fragment>
                        )
                    }

                    else if (Questions.kind == "MCQ") {
                        for (let i = 0; i < Questions1[Question].length - 1; i++) {
                            if (i == 0) {
                                distractorItem.push(<p>Answer:  {Questions1[Question][i]}</p>)
                            }
                            else {
                                distractorItem.push(<p>dis{i}:  {Questions1[Question][i]}</p>)
                            }
                        }
                        let disractorsDiv =
                            <div className="QuestionDistractors">
                                {distractorItem}
                            </div>

                        return (
                            <Fragment>
                                <div onClick={() => this.editModalFun(Question, Questions1[Question])} data-toggle="modal" data-target={"#generatedCard"} type="button" className="editQuestion"><i class="fas fa-edit"></i><p className="editHover">Edit Question</p> </div>
                                <div id={Question} key={Question} onClick={() => this.selectQuestion(Question)} className="generatedItem" style={this.props.generateQuestions ? itemStyle : {}}>
                                    <div className="generatedContent">
                                        Question:  {Questions1[Question][Questions1[Question].length - 1]}
                                    </div>
                                    <div className="line"></div>
                                    {disractorsDiv}
                                    <div className="line proline" style={{ 'marginTop': "15px", 'marginBottom': '15px' }}></div>
                                    <span className="protected"><span><i class="fas fa-lock"></i> Protected</span></span>
                                </div>
                            </Fragment>
                        )
                    }
                    else {
                        distractorItem.push(<p>Answer:  {Questions1[Question][0]}</p>)
                        distractorItem.push(<p>Distractor:  {Questions1[Question][1]}</p>)
                        let TorF = <div></div>
                        if (Questions1[Question][2] == "T") {
                            console.log("TTTTT")
                            // TorF = <span className={"TorF" + index}><span style={{ "color": "#08a431" }}><i class="fas fa-check-circle"></i> True</span></span>
                            $(".TF" + index).find("span").html("<i class='fas fa-check-circle'></i> True").css("color", "#08a431")
                        }
                        else {
                            console.log("FFFFF")
                            // TorF = <span className={"TorF" + index}><span style={{ "color": "#d90000" }}><i class="fas fa-times-circle"></i> False</span></span>
                            $(".TF" + index).find("span").html('<i class="fas fa-times-circle"></i> False').css("color", "#d90000")
                        }
                        let disractorsDiv =
                            <div className="TQuestionDistractors">
                                {distractorItem}
                            </div>
                        return (
                            <Fragment>
                                <div onClick={() => this.editModalFun(Question, Questions1[Question])} data-toggle="modal" data-target={"#generatedCard"} type="button" className="editQuestion"><i class="fas fa-edit"></i><p className="editHover">Edit Question</p> </div>
                                <div id={Question} key={Question} onClick={() => this.selectQuestion(Question)} className="generatedItem" style={this.props.generateQuestions ? itemStyle : {}} >

                                    <div className="generatedContent">
                                        Question:  {Questions1[Question][3]}
                                    </div>
                                    <div className="line"></div>
                                    {disractorsDiv}
                                    <div className="line"></div>
                                    <div className="trueOrFalse">
                                        <span className={"TorF TF" + index}><span></span></span>
                                    </div>
                                    <div className="line proline" style={{ 'marginTop': "15px", 'marginBottom': '15px' }}></div>
                                    <span className="protected"><span><i class="fas fa-lock"></i> Protected</span></span>
                                </div>
                            </Fragment>
                        )
                    }

                })

                // console.log("ListQuestions: ", ListQuestions)
                return (
                    <Fragment>
                        <div className="saveQuestionsButton" style={this.props.generateQuestions ? { "width": "90%", "marginLeft": "5%", "marginRight": "5%" } : {}}>
                            <div onClick={() => this.selectAll("selectAll")} type="submit" className="btn btn-primary btn-icon-split btn-md selectdiv " >
                                <span className="text"><i class="fas fa-clipboard-check"></i></span>
                                <p>Select All</p>
                            </div>
                            <h3 style={this.props.generateQuestions ? h3Style : {}}>Choose the questions you want to save</h3>
                            <div onClick={() => this.selectAll("not all")} type="submit" className="btn btn-primary btn-icon-split btn-md unSelectdiv " >
                                <span className="text"><i class="fas fa-trash-alt"></i></span>
                                <p>Unselect All</p>
                            </div>
                        </div>
                        <div style={this.props.generateQuestions ? genetatedContStyle : {}} className="generatedsContainer1" id="generatedsBody1" ref={(QuestionsBody1) => { this.QuestionsBody1 = QuestionsBody1 }}>
                            <div style={this.props.generateQuestions ? { "padding": "5px" } : {}} className="generatedsContainer" id="generatedsBody" ref={(QuestionsBody) => { this.QuestionsBody = QuestionsBody }}>

                                {ListQuestions}
                                <Modal modalName={"generatedCard"} body={this.state.EditQuestionModal} title={"Edit Question"} closeButton="close" />

                            </div>
                        </div>

                        <div className="saveQ" style={this.props.generateQuestions ? {} : { "position": "fixed" }}>
                            <button onClick={() => this.saveQuestions()} type="submit" className="btn btn-primary btn-icon-split btn-md selectButton " >
                                <span className="text"><i class="far fa-save"></i></span>
                                <p>Save Questions</p>
                            </button>

                        </div>
                    </Fragment>
                )
            }
            else {
                return (
                    <div></div>
                )
            }

        }



    }


    changeOption = (id) => {
        if (id == "uploadInput") {
            this.setState({
                text: ""
            })
            this.textarea.value = ""
        }
        else {
            this.setState({
                filePath: "",
                fileName: ""
            })

        }
        $(".optionItem").addClass('remove')
        $("#" + id).removeClass('remove')
        $(".option").css({
            'font-weight': 'normal',
            "text-decoration": "none",
            'font-size': '16px'
        })
        $("#" + id + "Item").css({
            'font-weight': 'bold',
            "text-decoration": "underline",
            'font-size': '17px'
        })
    }

    createPDf = () => {
        const styles = StyleSheet.create({
            page: {
                flexDirection: 'row',
                backgroundColor: '#E4E4E4'
            },
            section: {
                margin: 10,
                padding: 10,
                flexGrow: 1
            }
        });

        // Create Document Component
        const MyDocument = () => (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        );

        ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
    }



    render() {
        // console.log("filePath: ", this.state.filePath)
        if (this.state.filePath == "" && this.state.text == "") {
            $('#generateButton').css({
                "opacity": "0.5",
                "cursor": "not-allowed"
            })
            $('#generateButton').prop('disabled', 'true')
        }
        else {
            $('#generateButton').css({
                "opacity": "1",
                "cursor": "pointer"
            })
            $('#generateButton').prop('disabled', 'false')
        }

        const styles = StyleSheet.create({
            page: {
                flexDirection: 'row',
                backgroundColor: '#E4E4E4'
            },
            section: {
                margin: 10,
                padding: 10,
                flexGrow: 1
            }
        });



        // ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);


        $(".generateQuestionText").on('input', function () {
            var scroll_height = $(".generateQuestionText").get(0).scrollHeight;
            console.log(scroll_height)

            $(".generateQuestionText").css('height', scroll_height + 2 + 'px');
        });
        return (

            // <button onClick = {() => this.createPDf()}>click</button>
            this.renderScreen()
        )
    }
}
export default GenerteQuestions