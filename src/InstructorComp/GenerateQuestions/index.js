import React, { Component, Fragment } from 'react'
import './style.css'
import { read_cookie, bake_cookie } from 'sfcookies';
import { Ouroboro } from 'react-spinners-css';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import socketIOClient from "socket.io-client";
import $ from 'jquery'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'
import { confirm } from 'jquery-confirm'
import ReactToPdf from 'react-to-pdf'

import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

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
        screen: "generateQuestion",
        fileName:""

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





        const socket = socketIOClient("https://quizly-app.herokuapp.com")
        socket.on('sendQuestions', () => {
            this.getQuestions()
            this.setState({
                screen: "generatedQuestions"
            })
        })


    }

    getQuestions = async () => {
        const requestOptions1 = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
                            data["allowedQuestions"][question] = false
                        });

                        this.setState({
                            Questions: data,
                            screen: "generatedQuestions"
                        })
                        console.log("Questions arrived: ", data)
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
        this.setState({
            fileName:file.name
        })
        $('.saveImg').css('display', 'block')
        let formData = new FormData()
        formData.append('resource', file)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': read_cookie("token") },
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

        // let input = this.txtFile
        // // 
        // if (input.files && input.files[0]) {
        //     var reader = new FileReader();
        //     reader.onload = function (e) {
        //         $('#txtFile')
        //             .attr('src', e.target.result)
        //             .width(240)
        //             .height(300);
        //         
        //     };
        //     reader.readAsDataURL(input.files[0]);
        // }
    }

    saveFile = async () => {
        let file = this.txtFile.files[0]
        console.log(file)
        let formData = new FormData()
        formData.append('resource', file)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': read_cookie("token") },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
        }
    }

    saveQuestions = async () => {
        let QuestionsPackge = this.state.Questions
        console.log("QuestionsPackge : ", QuestionsPackge)
        let Questions = QuestionsPackge.Questions
        let { QuestionType } = this.state
        let { level } = this.state


        let levels = []
        let savedQuestions = []
        let kinds = []
        let keywords = []
        let publics = []
        let add_distructors = {}
        let { DomainName } = this.state
        let numofQuestions = 0
        console.log(Object.keys(Questions).length)
        for (let i = 0; i < Object.keys(Questions).length; i++) {
            if (QuestionsPackge["allowedQuestions"][i] == false) {
                console.log("false")
                continue
            }
            numofQuestions++
            if (level == "H") {
                levels.push("hard")
            }
            else {
                levels.push("medium")
            }
            if (QuestionType == "Complete") {
                savedQuestions.push(Questions[i][0])
            }
            else if (QuestionType == "MCQ") {
                savedQuestions.push(Questions[i][Questions[i].length - 1])
            }
            if (QuestionType == "MCQ") {
                kinds.push("mcq")
            }
            else if (QuestionType == "Complete") {
                kinds.push("complete")
            }



            if (QuestionType == "Complete") {
                keywords.push(Questions[i][1])
            }
            else {
                keywords.push(Questions[i][0])
            }

            publics.push("false")

            if (QuestionType == "MCQ") {
                add_distructors[i.toString()] = []
                for (let j = 1; j < Questions[i].length - 1; j++) {
                    add_distructors[i.toString()].push(Questions[i][j])
                }
            }
        }

        // console.log(levels)
        // console.log(savedQuestions)
        // console.log(kinds)
        // console.log(keywords)
        // console.log(publics)
        // console.log(add_distructors)
        // console.log(DomainName)

        $.confirm({
            title: 'Confirm!',
            boxWidth: '50%',
            useBootstrap: false,
            content: numofQuestions > 0 ? "Are you sure to save the selected questions??" : "You did not select any question , are you sure that you want to unsave all questions?",
            buttons: {
                confirm: async () => {
                    if (numofQuestions == 0) {
                        const requestOptions = {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
                            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
                            body: JSON.stringify({
                                "Level": levels,
                                "Question": savedQuestions,
                                "kind": kinds,
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
        if (Questions1 == false) {
            Questions.allowedQuestions[question] = true
            this.setState({
                Questions
            })
        }
        else {
            Questions.allowedQuestions[question] = false
            this.setState({
                Questions
            })
        }
        $("#" + question).toggleClass("selected")

    }

    selectAll = (type) => {
        let { Questions } = this.state
        let Questions1 = Questions.allowedQuestions
        if (type == "selectAll") {
            Object.keys(Questions.allowedQuestions).forEach(question => {
                Questions.allowedQuestions[question] = true
            });

            $(".generatedItem").addClass("selected")
        }
        else {
            Object.keys(Questions.allowedQuestions).forEach(question => {
                Questions.allowedQuestions[question] = false
            });
            $(".generatedItem").removeClass("selected")
        }
        this.setState({
            Questions
        })
    }


    renderScreen = () => {
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
                            <div className=" levels">
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Type of Questions: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.QuestionType} onChange={(e) => { this.setState({ QuestionType: e.target.value }) }} >
                                    <option value={"MCQ"}>MCQ</option>
                                    <option value={"trueorfalse"}>TrueOrFalse</option>
                                    <option value={"Complete"}>Complete</option>
                                </select >
                            </div>

                            <div className=" levels">
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Domain: </span>
                                <select data-menu id="QuestionType" className="select1" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                                    {ListDomains}
                                </select >
                            </div>

                            <div className=" levels">
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Level of Questions: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.level} onChange={(e) => { this.setState({ level: e.target.value }) }} >
                                    <option value={"H"}>Hard</option>
                                    <option value={"M"}>Medium</option>
                                </select >
                            </div>

                            <div className=" levels">
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Num of Answers: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.numOfAnswers} onChange={(e) => { this.setState({ numOfAnswers: e.target.value }) }} >
                                    <option value={2}>{2}</option>
                                    <option value={3}>{3}</option>
                                    <option value={4}>{4}</option>
                                    <option value={5}>{5}</option>
                                </select >
                            </div>
                        </div>

                        <div className="options">
                            <p onClick={() => this.changeOption("uploadInput")} style={{
                                'font-weight': 'bold',
                                'font-size': '17px'
                            }} className="option" id="uploadInputItem" >Upload Txt file</p>
                            <div className="line"></div>
                            <p onClick={() => this.changeOption("textarea")} className="option" id="textareaItem">Wirte in Text</p>



                        </div>


                        <div class="row optionItem remove" id="textarea" >
                            <div class="col-sm-12 form-group">
                                <textarea class="generateQuestionText" ref={(textarea) => { this.textarea = textarea }} type="textarea" name="comments" id="comments" placeholder="Your Question" rows="7" onBlur={(e) => { console.log(this.state.text); this.setState({ text: e.target.value }) }} ></textarea>
                            </div>
                        </div>

                        <div className="uploadTxtFile  optionItem" id="uploadInput">
                            <label className="uploadFile" style={{ "marginTop": "0px" }}>
                                <input type="file" name='txtFile' ref={(txtFile) => { this.txtFile = txtFile }} onChange={() => this.uploadImage()} className="fileInput form-control" />
                                <i className="fas fa-upload"></i> Upload File
                            </label>

                            <p className="" > {this.state.fileName}</p>
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
        else if (screen == "generatedQuestions") {
            let { Questions } = this.state
            let { QuestionType } = this.state
            console.log("QuestionType: ", QuestionType)
            let Questions1 = Questions.Questions

            if (Questions != "") {
                let ListQuestions = Object.keys(Questions1).map((Question, index) => {
                    let distractorItem = [];
                    if (QuestionType == "Complete") {
                        distractorItem.push(<p>Answer:  {Questions1[Question][1]}</p>)

                        let disractorsDiv =
                            <div className="QuestionDistractors">
                                {distractorItem}
                            </div>
                        return (
                            <div id={Question} key={Question} onClick={() => this.selectQuestion(Question)} className="generatedItem" >
                                <div className="generatedContent">
                                    Question:  {Questions1[Question][0]}
                                </div>
                                <div className="line"></div>
                                {disractorsDiv}
                            </div>
                        )
                    }
                    else if (QuestionType == "MCQ") {
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
                            <div id={Question} key={Question} onClick={() => this.selectQuestion(Question)} className="generatedItem" >
                                <div className="generatedContent">
                                    Question:  {Questions1[Question][Questions1[Question].length - 1]}
                                </div>
                                <div className="line"></div>
                                {disractorsDiv}
                            </div>
                        )
                    }

                })

                console.log("ListQuestions: ", ListQuestions)
                return (
                    <Fragment>
                        <div className="saveQuestionsButton" style={{ "marginTop": "0px", "justifyContent": "space-between" }}>
                            <button onClick={() => this.selectAll("selectAll")} style={{ "margin": "0px", "marginLeft": "10px" }} type="submit" className="btn btn-primary btn-icon-split btn-md selectButton " >
                                <span className="text">Select All</span>
                            </button>
                            <h3>Choose which questions do you want save..</h3>
                            <button onClick={() => this.selectAll("not all")} style={{ "margin": "0px", "marginRight": "10px" }} type="submit" className="btn btn-primary btn-icon-split btn-md selectButton " >
                                <span className="text">Unselect All</span>
                            </button>
                        </div>
                        <div className="generatedsContainer1" id="generatedsBody1" ref={(QuestionsBody1) => { this.QuestionsBody1 = QuestionsBody1 }}>
                            <div className="generatedsContainer" id="generatedsBody" ref={(QuestionsBody) => { this.QuestionsBody = QuestionsBody }}>

                                {ListQuestions}
                            </div>
                        </div>

                        <div className="saveQuestionsButton">
                            <button onClick={() => this.saveQuestions()} type="submit" className="btn btn-primary btn-icon-split btn-md selectButton " >
                                <span className="text">Save Questions</span>
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
        if(id == "uploadInput"){
            this.setState({
                text:""
            })
            this.textarea.value =""
        }
        else{
            this.setState({
                filePath:"",
                fileName:""
            })

        }
        $(".optionItem").addClass('remove')
        $("#" + id).removeClass('remove')
        $(".option").css({
            'font-weight': 'normal',
            'font-size': '16px'
        })
        $("#" + id + "Item").css({
            'font-weight': 'bold',
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
        console.log("filePath: ", this.state.filePath)
        if (this.state.filePath == "" && this.state.text =="") {
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