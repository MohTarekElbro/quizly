import React, { Component, version, Fragment } from 'react'
import './style.css'
import autosize from 'autosize'
import AddingQuestion from '../AddingQuestion'
import ExamNavbar from '../ExamNavbar'
import Questions from '../../components/Questions'
import $ from 'jquery'
import { read_cookie } from 'sfcookies'
import jsPDF from 'jspdf'
import GenerteQuestions from '../GenerateQuestions'

class GenerateExam extends Component {
    state = {
        examToolContent: "",
        Questions: [],
        deletedQuestions: [],
        currentPage: "",
        subject: "SW",
        university: "Helwan",
        faculty: "Computer science",
        duration: 120,

    }
    componentDidMount = () => {
        this.titlesValidation()
        this.changeToolContent("GenerateQuestions")
        $("#GenerateQuestions").click()

    }
    componentDidUpdate = () => {
        this.titlesValidation()
    }

    titlesValidation = () => {
        var { subject } = this.state
        var { university } = this.state
        var { faculty } = this.state
        var { duration } = this.state
        // console.log("Titles:", subject.length, university, faculty, duration)
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
            // console.log("dsdsdsdsdsdsdsdsdss")

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
            // console.log("id: ", id)
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
            else {
                this.setState({
                    examToolContent: <GenerteQuestions generateQuestions = "generate" />
                })
            }
        }
        else {
            // console.log("obaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            // console.log("backQuestion: ", newDeletedQuestions)
            // console.log("id: ", id)
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
        // console.log(currentPage, this.state.Questions)
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

    editQuestion = async (QuestionID, newQuestion = "", oldDistractor = "", newDistractor = "", addNewDistractor = "", removeOldDistractor = "", keyword = "") => {
        var { deletedQuestions } = this.state
        let addNewDistractor1 = ""
        let removeOldDistractor1 = ""
        let newDistractor1 = ""
        let oldDistractor1 = ""
        deletedQuestions.map((element) => {

            if (element._id == QuestionID) {

                if (newQuestion !== "") {
                    // console.log("Question: ", newQuestion)
                    element.Question = newQuestion
                }
                else if (oldDistractor !== "" && newDistractor !== "") {
                    // console.log("oldDistractor: ", oldDistractor)
                    // console.log("newDistractor: ", newDistractor)
                    oldDistractor1 = [oldDistractor]
                    newDistractor1 = [newDistractor]
                    element.distructor.map((dis, index) => {
                        if (dis == oldDistractor) {
                            element.distructor[index] = newDistractor
                        }
                    })
                }
                else if (keyword !== "") {
                    // console.log("keyword: ", keyword)
                    element.keyword = keyword
                }
                else if (removeOldDistractor !== "") {
                    // console.log("removeOldDistractor: ", removeOldDistractor)
                    removeOldDistractor1 = [removeOldDistractor]
                    element.distructor.map((dis, index) => {
                        if (dis == removeOldDistractor) {
                            element.distructor.splice(index, 1)
                            // console.log(element)
                        }
                    })
                }
                else if (addNewDistractor !== "") {
                    // console.log("nooooo")
                    // console.log("addNewDistractor: ", addNewDistractor)
                    element.distructor.push(addNewDistractor)
                    addNewDistractor1 = [addNewDistractor]
                }
            }
        });
        console.log("QuestionID: ", QuestionID)
        console.log("Question: ", newQuestion)
        console.log("oldDistractor: ", oldDistractor1)
        console.log("newDistractor: ", newDistractor1)
        console.log("addNewDistractor: ", addNewDistractor1)
        console.log("removeOldDistractor: ", removeOldDistractor1)
        console.log("keyword: ", keyword)
        this.setState({
            deletedQuestions
        })
        // console.log(newQuestion, oldDistractor, newDistractor)
        const requestOptions1 = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
            body: JSON.stringify({
                "Question": newQuestion,
                "NewDistructor": newDistractor1,
                "OldDistructor": oldDistractor1,
                "AddNewDistructor": addNewDistractor1,
                "RemoveOldDistructor": removeOldDistractor1,
                "keyword": keyword

            })
        };
        let api1;

        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/question/edit/' + QuestionID, requestOptions1)
            let data = await api1.json();
            console.log(data)
        }
        catch (e) {
            // console.log(e)
        }

    }

    generateExam = async () => {
        $("*").css("cursor", "progress");
        $("#generateExam").css("display", "none")
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
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
            body: JSON.stringify({
                "subject_name": subject,
                "university": university,
                "faculty": faculty,
                "duration": duration,
                "Questions": Questions

            })
        };
        let api1;

        try {
            api1 = await fetch('https://quizly-app.herokuapp.com/exam/create', requestOptions1)
            let data = await api1.json();
            // console.log(data)

        }
        catch (e) {
            // console.log(e)
        }

        this.generatePdf()
        $("*").css("cursor", "default");
        $("#generateExam").css("display", "block")
        this.setState({
            examToolContent: "",
            Questions: [],
            deletedQuestions: [],
            currentPage: "",

        })
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

    generatePdf = () => {
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
        doc.text(15, 30, "Subject: " + this.state.subject)
        doc.text(15, 50, "University: " + this.state.university)
        doc.text(15, 70, "Faculty: " + this.state.faculty)
        doc.text(15, 90, "Duration: " + this.state.duration)

        doc.text(40, 120, "__________________________________________________________")
        doc.text(40, 121, "__________________________________________________________")
        doc.text(40, 122, "__________________________________________________________")
        doc.text(40, 123, "__________________________________________________________")
        let leng = 190
        let newStart = 25
        let pageHeight = doc.internal.pageSize.height;
        doc.text(xOffset, 160, text)
        var Questions = []

        Questions = this.state.deletedQuestions.map((Question, index) => {
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
                Question.distructor.push(Question.keyword)
                this.shuffleArray(Question.distructor)
                Question.distructor.map((dis, index) => {
                    let splitDis = doc.splitTextToSize(dis, 530);
                    for (let i = 0; i < splitDis.length; i++) {
                        if (i == 0) {
                            doc.text(30, leng, letters[index + 1] + "- " + splitDis[i])
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

            }
            leng += 30
            if (leng > pageHeight) {
                doc.addPage()
                leng = newStart
            }
        })



        doc.save("exam.pdf")
    }

    render() {
        $('form').on('keydown', 'input[type=number]', function (e) {
            if (e.which == 38 || e.which == 40)
                e.css("color", "red")
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
                    <a className="deleteItem pointer" onClick={() => this.deleteQuestion(Question, this.props.counter)}><i class="far fa-trash-alt"></i></a>
                </div>
            )
        })



        return (

            <div className="GenerateExamContainer" >
                {/* <div onClick={() => this.showEaxmsList()} className="examsBar2"><i className="fas fa-bars"></i></div> */}

                <div className="examHalf examTools">
                    <div className="options1">
                        <p onClick={() => this.changeOption("GenerateQuestions")} id="GenerateQuestions" className="option1"><a onClick={() => this.changeToolContent("GenerateQuestions")} >GenerateQuestions</a></p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("addingNewQuestion")} id="addingNewQuestion" className="option1"><a onClick={() => this.changeToolContent("addingNewQuestion")} >AddNewQuestion</a> </p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("myQuestions")} id="myQuestions" className="option1"><a onClick={() => this.changeToolContent("myQuestions")} >MyQuestions</a></p>
                        <div className="line"></div>
                        <p onClick={() => this.changeOption("questionBank")} id="questionBank" className="option1"><a onClick={() => this.changeToolContent("questionBank")} >QuestionBank</a></p>
                        {/* <ExamNavbar changeToolContent={this.changeToolContent} ></ExamNavbar> */}

                    </div>
                    <div className="ExamToolBody" >
                        {examToolContent}
                    </div>
                </div>

                <div className="examHalf examDetails" id="examhalf">
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

                        <button onClick={() => this.generateExam()} type="submit" id="generateExam" className="btn btn-primary btn-icon-split btn-md generateButton " >
                            <span className="text">GenerateExam</span>
                        </button>
                    </div>
                </div>
            </div >
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
        autosize($(".distrr"));
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
            if (this.state.newDistractor == "Add new distractor....") {

            }
            else {
                this.props.editQuestion(this.props.Question._id, "", "", "", this.state.newDistractor)
            }
        }
        else if (this.props.keyword != null) {
            // console.log("keywordddd")
            if (this.state.newDistractor != this.props.Distractor) {
                this.props.editQuestion(this.props.Question._id, "", "", "", "", "", this.state.newDistractor)
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
        this.props.editQuestion(this.props.Question._id, "", "", "", "", this.props.Distractor)
    }

    renderDistractor = () => {
        if (this.props.Distractor == "Add new distractor....") {
            return (
                <li type="none" onClick={() => this.toggleState()} style={{ "border-bottom": "1px solid", "margin-left": "0px", "cursor": "pointer", "width": "150px" }}>
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
        if (this.props.Distractor == "Add new distractor....") {
            return (
                <form onSubmit={this.addDistractor}>
                    <textarea autoFocus className="distrr" onFocus={(e) => { e.target.select() }} type="text" value={this.state.newDistractor} onChange={(e) => this.setState({ newDistractor: e.target.value })} />
                    <button style={{ "font-size": "25px", "top": "3px", "right": "8%" }} type="submit"><i class="far fa-plus-square"></i></button>
                </form>
            )
        }
        else if (this.props.keyword != null) {
            return (
                <form onSubmit={this.addDistractor}>
                    <textarea autoFocus className="distrr" onFocus={(e) => { e.target.select() }} type="text" value={this.state.newDistractor} onChange={(e) => this.setState({ newDistractor: e.target.value })} />
                    {/* <input type="submit" value="Edit" /> */}
                    <button type="submit"><i class="fas fa-edit"></i></button>
                </form>
            )
        }
        else {
            return (
                <form onSubmit={this.addDistractor}>
                    <textarea autoFocus className="distrr" onFocus={(e) => { e.target.select() }} type="text" value={this.state.newDistractor} onChange={(e) => this.setState({ newDistractor: e.target.value })} />
                    <button type="submit"><i class="fas fa-edit"></i></button>
                    <button onClick={() => this.deleteDistractor()} className="pointer" ><i class="far fa-trash-alt"></i></button>
                </form>
            )
        }
    }
    render() {
        autosize($(".distrr"));
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
    componentDidUpdate = () => {
        autosize($(".questionInputText"));
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
            <form onSubmit={this.addQuestion} className="questionForm">
                <textarea class="questionInputText" autoFocus onFocus={(e) => { e.target.select() }} type="text" value={this.state.Question} onChange={(e) => this.setState({ Question: e.target.value })} />
                <input className="questionInputSubmit" type="submit" value="Edit" />
            </form>
        )
    }
    render() {
        autosize($(".questionInputText"));
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
                <input type="submit" value="Edit" />
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