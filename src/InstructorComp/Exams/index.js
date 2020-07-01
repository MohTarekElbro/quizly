import React, { Component } from 'react'
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { DropdownList } from 'react-widgets'
import { bake_cookie, read_cookie } from 'sfcookies'
import filter from 'filter'
import $ from 'jquery'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
// import ValueViewer from 'docs/src/pages/ValueViewer' // for examples only - displays the table above slider
import { SliderRail, Handle, Track, Tick } from '../sliderComps'
import loadjs from 'loadjs'
import jsPDF from 'jspdf'

import './style.css'
import Modal from '../../components/Modal'
import { withRouter } from 'react-router-dom'
// import '../../custom.js'




class Exams extends Component {

    state = {
        Exams: [],
        domains: [],
        search: "",
        subject_name: "",
        count: 10,
        version: 0,
        flag: true,
        helperheight: 100000,
        startDate: "",
        endDate: "",
        university: "",
        faculty: "",
        durationDomain: [0, 240],
        durationValues: [0, 240].slice(),
        durationUpdate: [0, 240].slice(),
        durationReversed: false,

        sliderStyle: {
            position: 'relative',
            width: ($(".FindForm").width() * 1).toString() + "px",
        },
        countDomain: [0, 100],
        countValues: [0, 100].slice(),
        countUpdate: [0, 100].slice(),
        countReversed: false,

        examDetails: "",


    }
    componentWillMount = () => {
        $('.optionItem').addClass("remove")
        $(".examsList").slideToggle(10)
        window.removeEventListener('resize', this.resize());
        $(".FindForm").resize(function () {
            if ($(".FindForm").width() > 1133) {
                // $('.examsList').animate({ scrollTop: 0 }, 1)
                $(".examsList").slideDown(1)
            }
            else {
                $(".examsList").slideUp(1)
            }
        })
    }

    generatePdf = (exam) => {
        var doc = new jsPDF('p', 'pt')
        // doc.fromHTML($('#examhalf').get(0), 5, 10)
        let letters = {
            1: "A",
            2: "B",
            3: "C",
            4: "D",
            5: "E",
            6: "F",
            7: "G",
            8: "H",
            9: "I",
            10: "J",
            11: "K",
            12: "L",
            13: "M",
            14: "N",

        }
        let text = "Answer The Following Questions"
        let xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
        doc.text(15, 30, "Subject: " + exam.subject_name)
        doc.text(15, 50, "University: " + exam.university)
        doc.text(15, 70, "Faculty: " + exam.faculty)
        doc.text(15, 90, "Duration: " + exam.duration)

        doc.text(40, 120, "__________________________________________________________")
        doc.text(40, 121, "__________________________________________________________")
        doc.text(40, 122, "__________________________________________________________")
        doc.text(40, 123, "__________________________________________________________")
        let leng = 190
        let newStart = 25
        let pageHeight = doc.internal.pageSize.height;
        doc.text(xOffset, 160, text)
        var Questions = []

        Questions = exam.Myexam.map((Question, index) => {
            let splitQuestion = doc.splitTextToSize(Question.Question, 550);
            for (let i = 0; i < splitQuestion.length; i++) {
                if (i == 0) {
                    doc.text(15, leng, index + 1 + "- " + splitQuestion[i])
                }
                else {
                    doc.text(15, leng, splitQuestion[i])
                }
                leng += 25
                if (leng >= pageHeight) {
                    doc.addPage()
                    leng = newStart
                }
            }
            if (leng > pageHeight) {
                doc.addPage()
                leng = newStart
            }
            // doc.text(30, leng, 1 + "- " + Question.keyword)
            // leng += 20
            // if (leng > pageHeight) {
            //     doc.addPage()
            //     leng = newStart
            // }


            if (Question.kind == "MCQ") {
                let distructorss = []
                distructorss.push(Question.keyword)
                for (let i = 0; i < Question.distructor.length; i++) {
                    distructorss.push(Question.distructor[i].distructor)
                }
                // Question.distructor.push(Question.keyword)
                this.shuffleArray(distructorss)
                distructorss.map((dis, id) => {
                    console.log(dis)
                    let splitDis = doc.splitTextToSize(dis, 530);
                    for (let i = 0; i < splitDis.length; i++) {
                        if (i == 0) {
                            doc.text(30, leng, letters[id + 1] + "- " + splitDis[i])
                        }
                        else {
                            doc.text(30, leng, splitDis[i])
                        }
                        leng += 20
                        if (leng >= pageHeight) {
                            doc.addPage()
                            leng = newStart
                        }
                    }
                    // doc.text(30, leng, letters[index + 1] + "- " + dis)
                    // leng += 20
                    if (leng > pageHeight) {
                        doc.addPage()
                        leng = newStart
                    }
                })
                leng += 30
                if (leng > pageHeight) {
                    doc.addPage()
                    leng = newStart
                }

            }
            else if (Question.kind == "T/F") {
                doc.text(30, leng, letters[1] + "- " + "True")
                leng += 20
                if (leng >= pageHeight) {
                    doc.addPage()
                    leng = newStart
                }
                doc.text(30, leng, letters[5] + "- " + "False")
                leng += 30
                if (leng > pageHeight) {
                    doc.addPage()
                    leng = newStart
                }
            }

        })



        doc.save("exam.pdf")
    }


    componentDidMount = async () => {
        if ($(document).width() > 1150) {
            // $('.examsList').animate({ scrollTop: 0 }, 1)
            $(".examsList").slideDown(500)
        }
        window.addEventListener('resize', this.resize());
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

        loadjs('js/demo/datatables-demo1.js')





    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
        };
        let api;

        try {
            api = await fetch('https://quizly-app.herokuapp.com/admin/Exams/', requestOptions)
            const data = await api.json();
            this.setState({
                Instractors: data
            })

        }
        catch (e) {
            console.log("no response");
        }


        this.props.history.push("/adminProfile")
        this.props.history.push("/adminHome/Exams")
    }

    findExams = async () => {

        this.setState({
            flag: true
        })
        var { version } = this.state
        var { count } = this.state
        var { subject_name } = this.state
        var { durationValues } = this.state
        var { countValues } = this.state
        var { startDate } = this.state
        var { endDate } = this.state
        var { university } = this.state
        var { faculty } = this.state
        console.log("subject_name: ", subject_name)
        console.log("durationValues: ", durationValues)
        console.log("countValues: ", countValues)
        console.log("startDate: ", startDate)
        console.log("endDate: ", endDate)
        console.log("university: ", university)
        console.log("faculty: ", faculty)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
            body: JSON.stringify({
                "subject_name": subject_name,
                "Search": {
                    "StartQuestion": countValues[0],
                    "EndQuestion": countValues[1],
                    "StartDate": startDate,
                    "EndDate": endDate,
                    "StartDuration": durationValues[0],
                    "EndDuration": durationValues[1],
                    "university": university,
                    "faculty": faculty
                }
            })
        };
        let api;
        this.setState({
            version: 0
        })

        try {

            let url = "https://quizly-app.herokuapp.com/exam/view/" + count + "/" + version;
            api = await fetch(url, requestOptions)
            const data = await api.json();
            console.log(api.status)
            if (api.status === 404) {
                this.setState({
                    Exams: []
                })
            }
            else if (data.length > 0) {
                console.log("Data: ", data)
                this.setState({
                    Exams: data
                })
                this.ExamsBody1.addEventListener('scroll', this.handleScroll);
            }
            else {
                this.setState({
                    Exams: []
                })
            }


        }
        catch (e) {
            console.log(e);
            this.setState({
                Exams: []
            })
        }
        // if ($(document).width() < 1150) {
        $(".examsList").slideUp(1)
        $(".examsList").slideDown(500)
        // }
        // this.showEaxmsList()
    }

    handleScroll = async (event) => {
        var obj = $('#ExamsBody1').scrollTop()
        // console.log(obj + 450, "height: ", $('#ExamsBody').height())

        // console.log("height2: ", this.state.helperheight)
        if (this.state.helperheight < $('#ExamsBody').height()) {
            this.setState({
                flag: true
            })
            // console.log("flag")
        }
        if (obj + 550 > $('#ExamsBody').height() && this.state.flag == true) {
            this.setState({
                flag: false
            })
            this.setState({ helperheight: $('#ExamsBody').height() })
            // console.log("done")
            var { version } = this.state
            var { count } = this.state
            var { subject_name } = this.state
            var { QuestionType } = this.state
            var { search } = this.state
            // console.log(version, this.state.Exams[0])
            if (version == 0 && this.state.Exams[0] == null) {

            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                    body: JSON.stringify({
                        "Domain_Name": subject_name,
                        "Question_Type": QuestionType,
                        "Search": search
                    })
                };
                let api;

                try {
                    this.setState({
                        version: version + 1
                    })
                    let url = "https://quizly-app.herokuapp.com/exam/view/" + count + "/" + version;
                    api = await fetch(url, requestOptions)
                    const data = await api.json();
                    // console.log(api.status)

                    if (api.status === 404) {
                        // console.log("if")
                        this.setState({
                            Exams: []
                        })
                    }
                    else if (data.length > 0) {
                        // console.log("else if")
                        this.setState({
                            Exams: this.state.Exams.concat(data)
                        })
                    }
                    else {
                        // console.log("else")
                        this.setState({
                            Exams: []
                        })
                    }


                }
                catch (e) {
                    console.log(e);
                    this.setState({
                        Exams: []
                    })
                }
            }
        }
    }

    changeOption = (id) => {
        $(".optionItem").addClass('remove')
        if ($("#" + id).hasClass("shown") == true) {
            $("#" + id).addClass('remove')
            $("#" + id).removeClass('shown')
            $(".option").css({
                'font-weight': 'normal',
                'font-size': '16px'
            })
        }
        else {
            $("#" + id).removeClass('remove')
            $(".optionItem").removeClass('shown')
            $("#" + id).addClass('shown')
            $(".option").css({
                'font-weight': 'normal',
                'font-size': '16px'
            })
            $("#" + id + "Item").css({
                'font-weight': 'bold',
                'font-size': '17px'
            })
        }
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    shuffleArray = (array) => {
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    renderFullExam = (id) => {
        console.log($('#' + id).height())
        if ($('#' + id).height() < 130) {
            $('#' + id).css({
                "height": "calc(100vh - 100px)",
                "overflow": "auto"
            })
        }
        else {
            $('#' + id).css({
                "height": "116px",
                "overflow": "hidden"
            })
        }

    }

    renderExamDetails = (exam) => {

        var Questions = []
        Questions = exam.Myexam.map((Question, index) => {
            let distractorsList = []
            if (Question.kind == "MCQ") {
                distractorsList = Question.distructor.map((dis) => {
                    return (
                        <li>{dis.distructor}</li>
                    )
                })
                distractorsList.push(
                    <li>{Question.keyword}</li>
                )
                distractorsList = this.shuffleArray(distractorsList)
            }
            else if (Question.kind == "T/F") {
                distractorsList.push(
                    <li>
                        {"true"}
                    </li>
                )
                distractorsList.push(
                    <li>
                        {"false"}
                    </li>
                )
            }

            return (
                <div key={Question._id} className="ExamQuestionItem"  >

                    <p className='question'>{index + 1}-  {Question.Question}</p>
                    <ol type="a" className="distructorsList">
                        {distractorsList}
                    </ol>
                    <a className="deleteItem pointer" onClick={() => this.deleteQuestion(Question, this.props.counter)}></a>
                </div>
            )
        })
        return (
            <div className="examDetails pointer">
                <div className="examTitle">
                    <p id="Subject Name" >Subject Name: {exam.subject_name}</p>
                    <p id="University" >University: {exam.university}</p>
                    <p id="Faculty" >Faculty: {exam.faculty}</p>
                    <p id="Duration" >Duration: {exam.duration}</p>
                </div>
                <div className="line"></div>
                <div className="following">
                    Anwser the following questions
                    </div>
                <div>
                    {Questions}
                </div>

                <div className="generateButtonContainer">

                    <button onClick={() => this.generatePdf(exam)} type="submit" id="generateExam" className="btn btn-primary btn-icon-split btn-md generateButton " >
                        <span className="text">GeneratePdf</span>
                    </button>
                </div>
            </div>
        )

    }

    resize = () => {
        console.log("dsdsdsdssdsds")
        if ($(document).width() > 1150) {
            // $('.examsList').animate({ scrollTop: 0 }, 1)
            $(".examsList").slideDown(1)
        }
        else {
            $(".examsList").slideUp(1)
        }
        console.log(($(".FindForm").width() * 1).toString() + "px")
        let { sliderStyle } = this.state
        console.log(sliderStyle)
        // sliderStyle['width'] = ($(".FindForm").width() * 1).toString() + "px"

        this.setState({
            sliderStyle
        })
    }

    showEaxmsList = () => {
        if ($(document).width() < 1150) {
            $('.examsList').animate({ scrollTop: 0 }, 1)
            $(".examsList").slideToggle(500)
        } else {
            $(".examsList").slideDown(1)
        }

        // if ($(".examsList").width() == 0) {

        //     $(".examsList").animate({
        //         width :"80%"
        //     },500)
        //     $(".examsList").css("padding", "10px")
        // }
        // else {
        //     $(".examsList").animate({
        //         width :"0%"
        //     },200)
        //     $(".examsList").css("padding", "0px")
        // }
    }

    pulsOrNot1 = (type, dir) => {
        console.log(type, dir)
        let { countValues } = this.state
        let { durationUpdate } = this.state
        if (dir == "right") {
            if (type == "plus") {
                if (countValues[1] + 1 <= 240) {
                    countValues[1]++
                    durationUpdate[1]++
                }
            }
            else {
                // console.log("not")
                countValues[1]--
                durationUpdate[1]--
            }
            console.log(countValues)
        }
        else {
            if (type == "plus") {
                // console.log("plus")
                countValues[0]++
                durationUpdate[0]++
            }
            else {
                if (countValues[0] - 1 >= 0) {
                    countValues[0]--
                    durationUpdate[0]--
                }
            }

        }
        if (countValues[0] != 0 || countValues[1] != 240) {
            $("#durationItem").addClass("edited")
        }
        else {
            $("#durationItem").removeClass("edited")
        }
        this.setState({
            countValues,
            durationUpdate
        })
    }



    pulsOrNot = (type, dir) => {
        console.log(type, dir)
        let { countValues } = this.state
        let { countUpdate } = this.state
        if (dir == "right") {
            if (type == "plus") {
                if (countValues[1] + 1 <= 240) {
                    countValues[1]++
                    countUpdate[1]++
                }
            }
            else {
                // console.log("not")
                countValues[1]--
                countUpdate[1]--
            }
            console.log(countValues)
        }
        else {
            if (type == "plus") {
                // console.log("plus")
                countValues[0]++
                countUpdate[0]++
            }
            else {
                if (countValues[0] - 1 >= 0) {
                    countValues[0]--
                    countUpdate[0]--
                }
            }

        }
        if (countValues[0] != 0 || countValues[1] != 100) {
            $("#numOfQuestionsItem").addClass("edited")
        }
        else {
            $("#numOfQuestionsItem").removeClass("edited")
        }
        this.setState({
            countValues,
            countUpdate
        })
    }

    render() {

        let {
            state: { durationDomain, durationValues, durationUpdate, durationReversed },
        } = this
        console.log(durationValues)
        let {
            state: { countDomain, countValues, countUpdate, countReversed },
        } = this

        var { Exams } = this.state
        var { selectedExam } = this.state
        var renderExamDetails = [];
        if (this.state.examDetails.Myexam != null) {
            renderExamDetails = this.renderExamDetails(this.state.examDetails)
        }
        else {
            renderExamDetails = (
                <div className="examDetails pointer" style={{ "opacity": "0.5" }}>

                    <div className="examTitle">
                        <p id="Subject Name" >Subject Name: </p>
                        <p id="University" >University: </p>
                        <p id="Faculty" >Faculty: </p>
                        <p id="Duration" >Duration: </p>
                    </div>
                    <div className="line"></div>
                    <div className="following">
                        Anwser the following questions
                    </div>

                </div>
            )
        }



        var ExamsList = Exams.map((exam, index) => {
            return (
                <div key={index} onClick={() => { this.setState({ examDetails: exam }); this.showEaxmsList(); $('.examDetails').animate({ scrollTop: 0 }, 1) }} className="selectExam pointer">

                    <div className="examTitle">
                        <p id="Subject Name" >Subject Name: {exam.subject_name}</p>
                        <p id="University" >University: {exam.university}</p>
                        <p id="Faculty" >Faculty: {exam.faculty}</p>
                        <p id="Duration" >Duration: {exam.duration}</p>
                    </div>
                </div>
            )
        })

        return (
            <div className="card shadow mb-4 FindFrom" >
                <div className="card-header py-3">
                    <div className="options">
                        <p onClick={() => this.changeOption("subject_name")} className="option " id="subject_nameItem">Subject Name</p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("numOfQuestions")} className="option" id="numOfQuestionsItem" >Number of questions</p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("date")} className="option" id="dateItem">Date</p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("duration")} className="option" id="durationItem">Duration of exam  </p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("university")} className="option" id="universityItem">University</p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("faculty")} className="option" id="facultyItem">Faculty</p>
                        <div className="line"></div>
                        <button onClick={() => this.findExams()} className="btn btn-primary btn-icon-split btn-sm searchExamButton" >

                            <span class="icon text-white-50">
                                <i class="fas fa-search"></i>
                            </span>
                            <span className="text">Search</span>
                        </button>
                    </div>
                    <form onSubmit={this.findExams} className="FindForm" ref={(FindForm) => { this.FindForm = FindForm }}>
                        <input id="subject_name" type="text" className="form-control bg-light small inputSearch optionItem remove " placeholder="Subject Name"
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.subject_name} onChange={(e) => { this.setState({ subject_name: e.target.value }); if (e.target.value != "") $("#" + e.target.id + "Item").addClass("edited"); else { $("#" + e.target.id + "Item").removeClass("edited") } }} />
                        <div id="duration" className="allRange optionItem remove">
                            <p>Duration of the exam: </p>
                            <div className="range">
                                <span className="updateShow1">
                                    <div className="pulsOrNot not" onClick={() => this.pulsOrNot("not", "left")}><i class="fas fa-minus-square"></i></div>
                                    <div className="pulsOrNot plus" onClick={() => this.pulsOrNot("plus", "left")}><i class="fas fa-plus-square"></i></div>
                                    {durationUpdate[0]}
                                </span>
                                <div className="rangeSlider">
                                    <Slider
                                        mode={2}
                                        step={1}
                                        domain={durationDomain}
                                        reversed={durationReversed}
                                        rootStyle={this.state.sliderStyle}
                                        onUpdate={durationUpdate => {
                                            this.setState({ durationUpdate })
                                        }}
                                        onChange={(durationValues) => {
                                            this.setState({ durationValues })
                                            if (durationValues[0] != 0 || durationValues[1] != 240) {
                                                $("#durationItem").addClass("edited")
                                            }
                                            else {
                                                $("#durationItem").removeClass("edited")
                                            }
                                        }}
                                        values={this.state.durationValues}
                                    >
                                        <Rail>
                                            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                                        </Rail>
                                        <Handles>
                                            {({ handles, getHandleProps }) => (
                                                <div className="slider-handles">
                                                    {handles.map(handle => (
                                                        <Handle
                                                            key={handle.id}
                                                            handle={handle}
                                                            domain={durationDomain}
                                                            getHandleProps={getHandleProps}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Handles>
                                        <Tracks left={false} right={false}>
                                            {({ tracks, getTrackProps }) => (
                                                <div className="slider-tracks">
                                                    {tracks.map(({ id, source, target }) => (
                                                        <Track
                                                            key={id}
                                                            source={source}
                                                            target={target}
                                                            getTrackProps={getTrackProps}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Tracks>

                                    </Slider>
                                </div>
                                <span className="updateShow2">
                                    <div className="pulsOrNot not" onClick={() => this.pulsOrNot("not", "right")}><i class="fas fa-minus-square"></i></div>
                                    <div className="pulsOrNot plus" onClick={() => this.pulsOrNot("plus", "right")}><i class="fas fa-plus-square"></i></div>
                                    {durationUpdate[1]}
                                </span>


                            </div>
                        </div>
                        <div id="numOfQuestions" className="allRange optionItem remove">
                            <p>Number of questions: </p>
                            <div className="range">
                                <span className="updateShow1">
                                    <div className="pulsOrNot not" onClick={() => this.pulsOrNot("not", "left")}><i class="fas fa-minus-square"></i></div>
                                    <div className="pulsOrNot plus" onClick={() => this.pulsOrNot("plus", "left")}><i class="fas fa-plus-square"></i></div>
                                    {countUpdate[0]}
                                </span>
                                <div className="rangeSlider">
                                    <Slider
                                        mode={2}
                                        step={1}
                                        domain={countDomain}
                                        rootStyle={this.state.sliderStyle}
                                        onUpdate={(countUpdate) => {
                                            this.setState({ countUpdate })
                                            // console.log(countUpdate[0] , countUpdate[1])
                                            // if(countUpdate[0] !=0 && countUpdate[1] != 50)$("#numOfQuestionsItem").addClass("edited");else{$("#numOfQuestionsItem").removeClass("edited")}
                                        }}
                                        onChange={(countValues) => {
                                            this.setState({ countValues })
                                            // console.log(countValues[0], countValues[1])
                                            if (countValues[0] != 0 || countValues[1] != 100) {
                                                $("#numOfQuestionsItem").addClass("edited")
                                            }
                                            else {
                                                $("#numOfQuestionsItem").removeClass("edited")
                                            }
                                        }}
                                        values={countValues}
                                    >
                                        <Rail>
                                            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                                        </Rail>
                                        <Handles>
                                            {({ handles, getHandleProps }) => (
                                                <div className="slider-handles">
                                                    {handles.map(handle => (
                                                        <Handle
                                                            key={handle.id}
                                                            handle={handle}
                                                            domain={countDomain}
                                                            getHandleProps={getHandleProps}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Handles>
                                        <Tracks left={false} right={false}>
                                            {({ tracks, getTrackProps }) => (
                                                <div className="slider-tracks">
                                                    {tracks.map(({ id, source, target }) => (
                                                        <Track
                                                            key={id}
                                                            source={source}
                                                            target={target}
                                                            getTrackProps={getTrackProps}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Tracks>

                                    </Slider>
                                </div>
                                <span className="updateShow2">
                                    <div className="pulsOrNot not" onClick={() => this.pulsOrNot("not", "right")}><i class="fas fa-minus-square"></i></div>
                                    <div className="pulsOrNot plus" onClick={() => this.pulsOrNot("plus", "right")}><i class="fas fa-plus-square"></i></div>
                                    {countUpdate[1]}
                                </span>
                            </div>
                        </div>
                        <div id="date" className="dates optionItem remove">
                            <div className="dateDiv" >
                                <p>Start date: </p>
                                <input type="date" className="form-control bg-light small inputSearch dateInput" placeholder="End date..."
                                    aria-label="Search" aria-describedby="basic-addon2" value={this.state.startDate} onChange={(e) => { this.setState({ startDate: e.target.value }); if (e.target.value != "") $("#dateItem").addClass("edited"); else { $("#dateItem").removeClass("edited") } }} />
                            </div>
                            <div className="dateDiv">
                                <p> End date: </p>
                                <input type="date" className="form-control bg-light small inputSearch dateInput" placeholder="End date..."
                                    aria-label="Search" aria-describedby="basic-addon2" value={this.state.endDate} onChange={(e) => { this.setState({ endDate: e.target.value }); if (e.target.value != "") $("#dateItem").addClass("edited"); else { $("#dateItem").removeClass("edited") } }} />
                            </div>
                        </div>
                        <input id="university" type="text" className="form-control bg-light small inputSearch optionItem remove " placeholder="University"
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.university} onChange={(e) => { this.setState({ university: e.target.value }); if (e.target.value != "") $("#" + e.target.id + "Item").addClass("edited"); else { $("#" + e.target.id + "Item").removeClass("edited") } }} />

                        <input id="faculty" type="text" className="form-control bg-light small inputSearch optionItem remove " placeholder="Faculty"
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.faculty} onChange={(e) => { this.setState({ faculty: e.target.value }); if (e.target.value != "") $("#" + e.target.id + "Item").addClass("edited"); else { $("#" + e.target.id + "Item").removeClass("edited") } }} />

                    </form>
                </div>
                <div className="ExamsContainer1" id="ExamsBody1" ref={(ExamsBody1) => { this.ExamsBody1 = ExamsBody1 }}>

                    <div className="ListExamsContainer" id="ExamsBody" ref={(ExamsBody) => { this.ExamsBody = ExamsBody }}>
                        <div onClick={() => this.showEaxmsList()} className="examsBar"><i className="fas fa-bars"></i></div>
                        <div className="examsList">
                            {ExamsList}
                        </div>
                        {renderExamDetails}

                    </div>
                </div>
            </div >
        )
    }
}

export default withRouter(Exams);