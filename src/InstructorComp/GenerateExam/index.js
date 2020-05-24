import React, { Component, version, Fragment } from 'react'
import './style.css'
import AddingQuestion from '../AddingQuestion'
import ExamNavbar from '../ExamNavbar'
import Questions from '../../components/Questions'
import $ from 'jquery'
import { read_cookie } from 'sfcookies'


class GenerateExam extends Component {
    state = {
        examToolContent: "",
        Questions: [],
        deletedQuestions: [],
        currentPage: "",
        subject: "",
        university: "",
        faculty: "",
        duration: "",

    }
    componentDidMount = () => {
        this.titlesValidation()
        
    }
    componentDidUpdate = () => {
        this.titlesValidation()
    }

    titlesValidation = () => {
        var { subject } = this.state
        var { university } = this.state
        var { faculty } = this.state
        var { duration } = this.state
        console.log("Titles:", subject.length, university, faculty, duration)
        let flag1 = false
        let flag2 = false
        let flag3 = false
        let flag4 = false
        let flag5 = false
        if (this.state.subject.length == 0) {
            flag1 = false
            $("#Subject").css("color", "red")
        }
        else {
            flag1 = true
        }

        if (this.state.university == "") {
            flag2 = false
            $("#University").css("color", "red")
        }
        else {
            flag2 = true
        }
        if (this.state.faculty == "") {
            flag3 = false
            $("#Faculty").css("color", "red")
        }
        else {
            flag3 = true
        }
        if (this.state.duration == "") {
            flag4 = false
            $("#Duration").css("color", "red")
        }
        else {
            flag4 = true
        }
        if (this.state.deletedQuestions.length == 0) {
            flag5 = false
        }
        else {
            flag5 = true
        }
        if (flag1 && flag2 && flag3 && flag4 && flag5) {
            console.log("dsdsdsdsdsdsdsdsdss")

            $('.generateButton').css({
                "opacity": "1",
                "cursor": "pointer"
            })
            $('.generateButton').prop('disabled', 'false')
        }
        else {
            $('.generateButton').css({
                "opacity": "0.5",
                "cursor": "not-allowed"
            })
            $('.generateButton').prop('disabled', 'true')
        }

    }




    changeToolContent = (id, newDeletedQuestions = null) => {
        if (newDeletedQuestions == null) {
            console.log("id: ", id)
            this.setState({
                currentPage: id
            })
            var { deletedQuestions } = this.state
            if (id == "addingNewQuestion") {
                this.setState({
                    examToolContent: <AddingQuestion pageType={id} deletedQuestions={deletedQuestions} getQuestion={this.getQuestion} />
                })
            }
            else if (id == "questionBank") {
                this.setState({
                    examToolContent: <Questions url="https://quizly-app.herokuapp.com/questionbank/" pageType={id} getItem={this.getQuestion} deletedQuestions={deletedQuestions} />
                })
            }
            else if (id == 'myQuestions') {
                this.setState({
                    examToolContent: <Questions url="https://quizly-app.herokuapp.com/instructor/getmyQuestions/" pageType={id} getItem={this.getQuestion} deletedQuestions={deletedQuestions} />
                })
            }
        }
        else {
            console.log("obaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            console.log("backQuestion: ", newDeletedQuestions)
            console.log("id: ", id)
            var { deletedQuestions } = this.state
            if (id == "addingNewQuestion") {
                this.setState({
                    examToolContent: <AddingQuestion getQuestion={this.getQuestion} />
                })
            }
            else if (id == "questionBank") {
                this.setState({
                    examToolContent: <Questions url="https://quizly-app.herokuapp.com/questionbank/" pageType={id} getItem={this.getQuestion} deletedQuestions={deletedQuestions} backQuestion={newDeletedQuestions} />
                })
            }
            else if (id == 'myQuestions') {
                this.setState({
                    examToolContent: <Questions url="https://quizly-app.herokuapp.com/instructor/getmyQuestions/" pageType={id} getItem={this.getQuestion} deletedQuestions={deletedQuestions} backQuestion={newDeletedQuestions} />
                })
            }
        }
    }

    deleteQuestion = (Question) => {
        let index = 0
        var { deletedQuestions } = this.state

        deletedQuestions.map((element, i) => {
            if (element._id == Question._id) {
                index = i
            }
        });
        deletedQuestions.splice(index, 1)
        this.setState({
            deletedQuestions
        })
        var { currentPage } = this.state
        console.log(currentPage, this.state.Questions)
        let different = Math.random()
        Question["different"] = different
        this.changeToolContent(currentPage, Question)
    }

    getQuestion = (Question) => {
        var { deletedQuestions } = this.state
        deletedQuestions.push(Question)
        this.setState({
            deletedQuestions
        })

    }



    addTitle = (titleValue, title) => {
        if (title == "Subject") {
            this.setState({
                subject: titleValue
            })
        }
        else if (title == "University") {
            this.setState({
                university: titleValue
            })
        }
        else if (title == "Faculty") {
            this.setState({
                faculty: titleValue
            })
        }
        else {
            this.setState({
                duration: titleValue
            })
        }
    }

    editQuestion = async (QuestionID, newQuestion = "", oldDistractor = "", newDistractor = "", keyword = "") => {
        var { deletedQuestions } = this.state
        deletedQuestions.map((element) => {
            console.log("keyword: ", keyword)
            if (element._id == QuestionID) {
                if (newQuestion !== "") {
                    element.Question = newQuestion
                }
                else if (oldDistractor !== "" && newDistractor !== "") {
                    element.distructor.map((dis, index) => {
                        if (dis == oldDistractor) {
                            element.distructor[index] = newDistractor
                        }
                    })
                }
                else if (keyword !== "") {
                    element.keyword = keyword
                }
                else if (oldDistractor !== "" && newDistractor == "") {

                    element.distructor.map((dis, index) => {
                        if (dis == oldDistractor) {
                            element.distructor.splice(index, 1)
                            console.log(element)
                        }
                    })
                }
                else {
                    console.log("nooooo")
                    element.distructor.push(newDistractor)
                }
            }
        });
        this.setState({
            deletedQuestions
        })
        console.log(newQuestion, oldDistractor, newDistractor)
        const requestOptions1 = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "Question": newQuestion,
                "OldDistructor": oldDistractor,
                "keyword": keyword,
                "NewDistructor": newDistractor,

            })
        };
        let api1;

        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/question/edit/' + QuestionID, requestOptions1)
            let data = await api1.json();
        }
        catch (e) {
            console.log(e)
        }

    }

    generateExam = async () => {
        var Questions = []
        var { deletedQuestions } = this.state
        deletedQuestions.forEach(element => {
            Questions.push(element._id)
        });
        var { subject } = this.state
        var { university } = this.state
        var { faculty } = this.state
        var { duration } = this.state

        const requestOptions1 = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': read_cookie("token") },
            body: JSON.stringify({
                "domain_name": subject,
                "university": university,
                "faculty": faculty,
                "duration": duration,
                "Questions": Questions

            })
        };
        let api1;

        try {
            api1 = await fetch('http://localhost:3500/exam/create', requestOptions1)
            let data = await api1.json();
            console.log(data)
        }
        catch (e) {
            console.log(e)
        }
    }

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

    changeOption = (id) => {
        $(".option1").css({
            'font-weight': 'normal',
            'font-size': '16px',
            'text-decoration': 'none'
        })
        $("#" + id).css({
            'font-weight': 'bold',
            'font-size': '17px',
            'text-decoration': 'underline'
        })
    }

    render() {
        $('form').on('keydown', 'input[type=number]', function (e) {
            if (e.which == 38 || e.which == 40)
                e.css("color" , "red")
        });
        var { examToolContent } = this.state
        var Questions = []
        Questions = this.state.deletedQuestions.map((Question, index) => {
            let distractorsList = []
            if (Question.kind == "MCQ") {
                distractorsList = Question.distructor.map((dis) => {
                    return (
                        <DistractorContent editQuestion={this.editQuestion} Distractor={dis} Question={Question} />
                    )
                })
                distractorsList.push(
                    <DistractorContent editQuestion={this.editQuestion} underline={{ "color": "red" }} keyword={Question.keyword} Distractor={Question.keyword} Question={Question} />
                )
                distractorsList = this.shuffleArray(distractorsList)
                distractorsList.push(
                    <DistractorContent editQuestion={this.editQuestion} Distractor={"Add new distractor...."} Question={Question} />
                )

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

                    <QuestionContent index={index} editQuestion={this.editQuestion} Question={Question} />
                    <ol type="a" className="distructorsList">
                        {distractorsList}
                    </ol>
                    <a className="deleteItem pointer" onClick={() => this.deleteQuestion(Question, this.props.counter)}><i class='fas fa-times'></i></a>
                </div>
            )
        })



        return (
            <div className="GenerateExamContainer" >
                <div className="examHalf examDetails">
                    <div className="examTitle">
                        <ExamTitle title="Subject" addTitle={this.addTitle} />
                        <ExamTitle title="University" addTitle={this.addTitle} />
                        <ExamTitle title="Faculty" addTitle={this.addTitle} />
                        <ExamTitle title="Duration" addTitle={this.addTitle} />
                    </div>
                    <div className="line"></div>
                    <div className="following">
                        Anwser the following questions
                    </div>
                    <div>
                        {Questions}
                    </div>
                    <div className="generateButtonContainer">
                        <button onClick={() => this.generateExam()} type="submit" className="btn btn-primary btn-icon-split btn-md generateButton " >
                            <span className="text">GenerateExam</span>
                        </button>
                    </div>
                </div>
                <div className="examHalf examTools">
                    <div className="options1">
                        <p onClick={() => this.changeOption("addingNewQuestion")} id="addingNewQuestion" className="option1"><a onClick={() => this.changeToolContent("addingNewQuestion")} >AddNewQuestion</a> </p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("myQuestions")} id="myQuestions" className="option1"><a onClick={() => this.changeToolContent("myQuestions")} >MyQuestions</a></p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("questionBank")} id="questionBank" className="option1"><a onClick={() => this.changeToolContent("questionBank")} >QuestionBank</a></p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("GenerateQuestions")} id="GenerateQuestions" className="option1"><a>GenerateQuestions</a></p>

                        {/* <ExamNavbar changeToolContent={this.changeToolContent} ></ExamNavbar> */}

                    </div>
                    <div className="ExamToolBody" >
                        {examToolContent}
                    </div>
                </div>
            </div>
        )


    }
}

export default GenerateExam;






class DistractorContent extends Component {
    state = {
        isEdit: true,
        oldDistractor: "",
        newDistractor: "",
        delete: false
    }

    componentWillMount = () => {

        this.setState({
            oldDistractor: this.props.Distractor,
            newDistractor: this.props.Distractor
        })

    }
    componentDidUpdate = () => {

        if (this.state.oldDistractor != this.props.Distractor) {
            this.setState({
                oldDistractor: this.props.Distractor,
                newDistractor: this.props.Distractor
            })
        }
    }

    toggleState = () => {
        if (this.state.isEdit == false) {
            this.setState({
                isEdit: true
            })
        }
        else {
            this.setState({
                isEdit: false
            })
        }
    }
    addDistractor = (e) => {
        e.preventDefault()
        this.toggleState()
        if (this.props.Distractor == "Add new distractor....") {
            this.props.editQuestion(this.props.Question._id, "", "", this.state.newDistractor)
        }
        else if (this.props.keyword != null) {
            console.log("keywordddd")
            if (this.state.newDistractor != this.props.Distractor) {
                this.props.editQuestion(this.props.Question._id, "", "", "", this.state.newDistractor)
            }
        }
        else {
            if (this.state.newDistractor != this.props.Distractor) {
                this.props.editQuestion(this.props.Question._id, "", this.props.Distractor, this.state.newDistractor)
            }
        }
    }
    deleteDistractor = () => {

        this.toggleState()
        this.props.editQuestion(this.props.Question._id, "", this.props.Distractor, "")
    }

    renderDistractor = () => {
        if (this.props.Distractor == "Add new distractor....") {
            return (
                <li type="none" onClick={() => this.toggleState()}>
                    {this.state.oldDistractor}
                </li>
            )
        }

        else {
            return (
                <li style={this.props.underline} onClick={() => this.toggleState()}>
                    {this.state.newDistractor}
                </li>
            )
        }
    }


    renderEditDistractor = () => {
        if (this.props.keyword != null) {
            return (
                <form onSubmit={this.addDistractor}>
                    <input autoFocus onFocus={(e) => { e.target.select() }} type="text" value={this.state.newDistractor} onChange={(e) => this.setState({ newDistractor: e.target.value })} />
                    <input type="submit" value="submit" />
                </form>
            )
        }
        else {
            return (
                <form onSubmit={this.addDistractor}>
                    <input autoFocus onFocus={(e) => { e.target.select() }} type="text" value={this.state.newDistractor} onChange={(e) => this.setState({ newDistractor: e.target.value })} />
                    <input type="submit" value="submit" />
                    <span onClick={() => this.deleteDistractor()} className="pointer" style={{ "marginLeft": "5px" }}><i class='fas fa-times ' ></i></span>

                </form>
            )
        }
    }
    render() {
        var { isEdit } = this.state
        return (
            <Fragment>
                {isEdit ? this.renderDistractor() : this.renderEditDistractor()}
            </Fragment>
        )
    }

}











class QuestionContent extends Component {
    state = {
        isEdit: true,
        Question: ""
    }

    componentWillMount = () => {
        this.setState({
            Question: this.props.Question.Question
        })
    }

    toggleState = () => {
        if (this.state.isEdit == false) {
            this.setState({
                isEdit: true
            })
        }
        else {
            this.setState({
                isEdit: false
            })
        }
    }
    addQuestion = (e) => {
        e.preventDefault()
        this.toggleState()
        this.props.editQuestion(this.props.Question._id, this.state.Question)
    }

    renderQuestion = (Question) => {
        return (
            <p onClick={() => this.toggleState()} className='question'>{this.props.index + 1}-  {this.state.Question}</p>
        )
    }


    renderEditQuestion = () => {
        return (
            <form onSubmit={this.addQuestion}>
                <input autoFocus onFocus={(e) => { e.target.select() }} type="text" value={this.state.Question} onChange={(e) => this.setState({ Question: e.target.value })} />
                <input type="submit" value="submit" />
            </form>
        )
    }
    render() {
        var { isEdit } = this.state
        return (
            <Fragment>
                {isEdit ? this.renderQuestion(this.props.Question) : this.renderEditQuestion()}
            </Fragment>
        )
    }

}





class ExamTitle extends Component {
    state = {
        isEdit: true,
        title: ""
    }

    toggleState = () => {
        if (this.state.isEdit == false) {
            this.setState({
                isEdit: true
            })
        }
        else {
            this.setState({
                isEdit: false
            })
        }
    }
    addTitle = (e) => {
        e.preventDefault()
        this.toggleState()
        this.props.addTitle(this.state.title, this.props.title)
    }

    renderTitle = (title) => {
        return (
            <p className="pointer" id={title} onClick={() => this.toggleState()}>{title}: {this.state.title}</p>
        )
    }


    renderEditTitle = () => {
        let type = ""
        if (this.props.title == "Duration") {
            type = "number"
        }
        else {
            type = "text"
        }
        return (
            <form onSubmit={this.addTitle}>
                <input autoFocus onFocus={(e) => { e.target.select() }} type={type} value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
                <input type="submit" value="submit" />
            </form>
        )
    }
    render() {

        var { isEdit } = this.state
        return (
            <Fragment>
                {isEdit ? this.renderTitle(this.props.title) : this.renderEditTitle()}
            </Fragment>
        )
    }

}