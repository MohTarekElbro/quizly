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
import './style.css'
import Modal from '../../components/Modal'
import { withRouter } from 'react-router-dom'
// import '../../custom.js'

const sliderStyle = {
    position: 'relative',
    width: '350px',
}


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
        $(window).resize(function () {
            if ($(window).width() > 1133) {
                // $('.examsList').animate({ scrollTop: 0 }, 1)
                $(".examsList").slideDown(1)
            }
            else {
                $(".examsList").slideUp(1)
            }
        })
    }


    componentDidMount = async () => {
        if ($(document).width() > 1150) {
            // $('.examsList').animate({ scrollTop: 0 }, 1)
            $(".examsList").slideDown(500)
        }
        window.addEventListener('resize', this.resize());
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
            console.log("no response");
        }

        loadjs('js/demo/datatables-demo1.js')





    }

    Refresh = async () => {
        const requestOptions = {
            method: 'Get',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
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


    render() {



        const {
            state: { durationDomain, durationValues, durationUpdate, durationReversed },
        } = this
        const {
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
                    <form onSubmit={this.findExams} className="FindForm">
                        <input id="subject_name" type="text" className="form-control bg-light small inputSearch optionItem remove " placeholder="subject_name"
                            aria-label="Search" aria-describedby="basic-addon2" value={this.state.subject_name} onChange={(e) => { this.setState({ subject_name: e.target.value }); if (e.target.value != "") $("#" + e.target.id + "Item").addClass("edited"); else { $("#" + e.target.id + "Item").removeClass("edited") } }} />
                        <div id="duration" className="allRange optionItem remove">
                            <p>Duration of the exam: </p>
                            <div className="range">
                                <span className="updateShow1"> {durationUpdate[0]} </span>
                                <div className="rangeSlider">
                                    <Slider
                                        mode={2}
                                        step={1}
                                        domain={durationDomain}
                                        reversed={durationReversed}
                                        rootStyle={sliderStyle}
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
                                        values={durationValues}
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
                                <span className="updateShow2"> {durationUpdate[1]} </span>
                            </div>
                        </div>
                        <div id="numOfQuestions" className="allRange optionItem remove">
                            <p>Number of questions: </p>
                            <div className="range">
                                <span className="updateShow1"> {countUpdate[0]} </span>
                                <div className="rangeSlider">
                                    <Slider
                                        mode={2}
                                        step={1}
                                        domain={countDomain}
                                        rootStyle={sliderStyle}
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
                                <span className="updateShow2"> {countUpdate[1]} </span>
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

                        <input id="faculty" type="text" className="form-control bg-light small inputSearch optionItem remove " placeholder="faculty"
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