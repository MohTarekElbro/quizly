import React, { Component, Fragment } from 'react'
import './style.css'
import { read_cookie } from 'sfcookies'
import $ from 'jquery'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'
import { confirm } from 'jquery-confirm'
import autosize from 'autosize'


class AddingQuestion extends Component {

    state = {
        QuestionType: "MCQ",
        public: "none",
        numOfDis: 1,
        distructorsValue: [],
        state: 'true',
        level: "",
        domains: [],
        DomainName: "SW",
        keyword: "",
        Question: "",
        random: 0,

        editedDistructors: {},
        existedLength: 0,
        existedDistructors: [],
        oldDistructors: "",
        newDistructors: "",
        addNewDistructors: [],
        removeOldDistructors: [],


        hhh: ""
    }

    propsQuestions = () => {
        if (this.props.Question) {
            // console.log("index", this.props.Question)
            $("#QuestionsType" + this.props.index).css("display", "none")
            $("#domains" + this.props.index).css("display", "none")
            let Q = this.props.Question
            $(".public111").css("color", "black")
            if (Q.public == true) {
                console.log("public")
                $("#public" + this.props.index).css("color", "#4e73df")
                $("#public" + this.props.index).click()
            }
            else {
                console.log("private")
                // $("input[name='public']").css("display","none")
                $("#private" + this.props.index).css("color", "#4e73df")
                $("#private" + this.props.index).click()
            }

            $(".trueorfalse").css("color", "black")
            if (Q.state == true) {
                console.log("TRUE")
                $("#trueChoose" + this.props.index).css("color", "#4e73df")
                $("#trueChoose" + this.props.index).click()
            }
            else {
                console.log("FALSE")
                // $("input[name='public']").css("display","none")
                $("#falseChoose" + this.props.index).css("color", "#4e73df")
                $("#falseChoose" + this.props.index).click()
            }
            $(".level11").css("color", "black")
            $("#" + Q.Level + this.props.index).css("color", "#4e73df")
            $("#" + Q.Level + this.props.index).click()

            var { QuestionType } = this.state
            if (QuestionType == "MCQ") {
                $("#MCQ").click()
            }
            else if (QuestionType == "Complete") {
                $("#Complete").click()
            }
            else {
                $("#trueorfalse").click()
            }
        }
        if (this.props.Question) {
            const Question = this.props.Question
            let ex = []
            let old = []
            let random = this.props.random
            if (Question.distructor) {
                for (let i = 0; i < Question.distructor.length; i++) {
                    ex.push(Question.distructor[i])
                }

                for (let i = 0; i < Question.distructor.length; i++) {
                    old.push(Question.distructor[i])
                }
            }
            this.setState({
                Question: Question.Question,
                QuestionType: Question.kind,
                public: Question.public ? true : false,
                numOfDis: Question.distructor ? Question.distructor.length : 0,
                existedLength: Question.distructor ? Question.distructor.length : 0,
                distructorsValue: old,
                existedDistructors: ex,
                hhh: Question.distructor,
                state: Question.state ? Question.state : true,
                level: Question.Level,
                DomainName: Question.domain.domain_name,
                keyword: Question.keyword,
                random: random, 
                oldDistructors: "",
                newDistructors: "",
                addNewDistructors: [],
                removeOldDistructors: [],
            })
            // $("input[type=radio]").css("opacity" , "0")
        }
    }

    tempPropsQuestions = () => {
        // console.log("MOHAMED")
        if (this.props.tempQuestion) {
            console.log("tempQuestion: ", this.props.tempQuestion)
            $("#QuestionsType" + this.props.index).css("display", "none")
            $("#domains" + this.props.index).css("display", "none")
            let Q = this.props.tempQuestion
            $(".public111").css("color", "black")
            $("#private" + this.props.index).css("color", "#4e73df")
            $("#private" + this.props.index).click()

            $(".trueorfalse").css("color", "black")

            // console.log("Q.Level: " , Q.Level)
            $(".level11").css("color", "black")
            $("#" + this.props.Level + this.props.index).css("color", "#4e73df")
            $("#" + this.props.Level + this.props.index).click()

            // var { QuestionType } = this.state
            console.log("this.props.QuestionType: ", this.props.QuestionType)
            if (this.props.QuestionType == "MCQ") {
                $("#MCQ").click()
            }
            else if (this.props.QuestionType == "Complete") {
                $("#Complete").click()
            }
            else {
                $("#trueorfalse").click()
                if (Q[2] == "T") {
                    console.log("TRUEeeee")
                    $("#trueChoose" + this.props.index).css("color", "#4e73df")
                    $("#trueChoose" + this.props.index).click()
                }
                else {
                    console.log("FALSEeee")
                    // $("input[name='public']").css("display","none")
                    $("#falseChoose" + this.props.index).css("color", "#4e73df")
                    $("#falseChoose" + this.props.index).click()
                }
            }
        }

        if (this.props.tempQuestion) {
            const Question = this.props.tempQuestion
            let ex = []
            // console.log(Question)
            let old = []
            let random = this.props.random
            if (this.props.QuestionType == "MCQ") {

                for (let i = 1; i < Question.length - 1; i++) {
                    ex.push(Question[i])
                }
                this.setState({
                    numOfDis: Question.length - 2,
                    distructorsValue: ex,
                    keyword: Question[0],
                    Question: Question[Question.length - 1],
                })
            }
            else if (this.props.QuestionType == "trueorfalse") {
                console.log("Question: ", Question)
                this.setState({
                    numOfDis: 1,
                    distructorsValue: [Question[1]],
                    keyword: Question[0],
                    Question: Question[3],

                })
                console.log("Question[2]: ", Question[2])
                if (Question[2] == "F") {

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
            else {
                this.setState({
                    keyword: Question[1],
                    Question: Question[0],
                })
            }
            this.setState({
                QuestionType: this.props.QuestionType,
                public: false,
                level: this.props.Level,
                DomainName: this.props.domain,
                random: random,
                oldDistructors: "",
                newDistructors: "",
                addNewDistructors: [],
                removeOldDistructors: [],
            })

        }
    }
    componentDidUpdate = () => {
        autosize($(".addQuestionText"))
        // console.log("UPDAAAAAAAAAAATED")
        if (this.props.random != this.state.random) {
            // console.log("UPDAAAAAAAAAAATED")
            this.propsQuestions()
            this.tempPropsQuestions()

        }

    }



    componentDidMount = async () => {
        this.tempPropsQuestions()
        this.propsQuestions()
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
                        <input type="submit" class=" btn-secondary btn btn-lg  btn-block" value={this.props.Question || this.props.tempQuestion ? "Edit" : "Add"} />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////MCQ Functions////////////////////////////////

    addNewDistructor = (i) => {
        var { distructorsValue } = this.state
        var { addNewDistructors } = this.state
        let numOfDis = this.state.numOfDis
        numOfDis++
        distructorsValue[i] = "Add New Distructor"

        this.setState({
            numOfDis,
            distructorsValue
        })
        addNewDistructors.push(distructorsValue[i])
        console.log("add New Dis: ", addNewDistructors)
        console.log("numOfDis: ", numOfDis, "existedlength", this.state.existedLength)

        this.setState({
            addNewDistructors
        })
        // var { numOfDis } = this.state
    }

    removeDistructor = (i) => {
        console.log("d5lt hna kam mraaaaaa?!!!")
        var { distructorsValue } = this.state
        if (this.props.Question) {
            let { existedDistructors } = this.state
            let { removeOldDistructors } = this.state
            let { existedLength } = this.state
            let { editedDistructors } = this.state
            let { addNewDistructors } = this.state
            console.log("numOfDis: ", i + 1, "existedlength", this.state.existedLength)
            if (i + 1 <= existedLength) {
                console.log("remove one from existed!: ", distructorsValue[i])
                if (editedDistructors[existedDistructors[i]] != null) {
                    console.log("remove Edited one")
                    // editedDistructors.filter(index => index.existedDistructors[i] != null)
                    delete editedDistructors[existedDistructors[i]]
                    console.log("editedDistructors: ", editedDistructors)
                    removeOldDistructors.push(existedDistructors[i])
                }
                else {
                    removeOldDistructors.push(distructorsValue[i])
                }
                existedDistructors.splice(i, 1)
                existedLength--
                console.log("removeOldDistructors: ", removeOldDistructors)
            }
            else {
                console.log("remove one from new!")
                addNewDistructors.splice(i + 1 - this.state.numOfDis - 1, 1)
                console.log("addNewDistructors: ", addNewDistructors)
            }
            this.setState({
                removeOldDistructors,
                existedDistructors,
                existedLength,
                addNewDistructors
            })
        }
        console.log("RemoveID: ", i)
        this.setState({
            numOfDis: this.state.numOfDis - 1
        })

        distructorsValue.splice(i, 1)
        this.setState({
            distructorsValue
        })

    }

    distructor = (i) => {
        var { numOfDis } = this.state
        let span;
        let a;
        if (i != 0) {
            span = (
                <span onClick={() => this.removeDistructor(i)} className="deleteInstructorIcon">
                    <i class="fas fa-times-circle"></i>
                </span>
            )
        }
        if ((i + 1) == numOfDis) {
            a = <a id={"dis" + i} onClick={() => this.addNewDistructor(i + 1)} className="addQuestions   " >
                <span className="icon text-white-50 ">
                    <i class="fas fa-plus-square"></i>
                </span>
            </a>
        }


        return (
            <div className="disDiv" id={"disDiv" + i} style={{ "marginBottom": "20px" }}>
                <input id={"disInput" + i} type="text" autoFocus className="form-control bg-light  small inputSearch" onFocus={(e) => { e.target.select() }} placeholder="Add New Distructor"
                    aria-label="Search" aria-describedby="basic-addon2" value={this.state.distructorsValue[i]} onChange={(e) => {
                        let { distructorsValue } = this.state
                        let { existedDistructors } = this.state
                        distructorsValue[i] = e.target.value
                        this.setState({
                            distructorsValue
                        })

                        if (this.props.Question) {
                            if (i + 1 <= this.state.existedLength) {
                                // let newDistructors = this.state.newDistructors
                                // let oldDistructors = this.state.oldDistructors
                                // let {existedDistructors} = this.state
                                let editedDistructors = this.state.editedDistructors
                                // console.log("existedDistructors: " , this.state.existedDistructors)
                                editedDistructors[this.state.existedDistructors[i]] = e.target.value
                                this.setState({
                                    editedDistructors
                                })
                                // console.log("editedDistructors: " , editedDistructors)
                            }
                            else {
                                let addNewDistructors = this.state.addNewDistructors
                                addNewDistructors[i - this.state.existedLength] = e.target.value
                                this.setState({
                                    addNewDistructors
                                })
                                // console.log("addNewDistructors: " , addNewDistructors)
                            }
                        }

                    }} />

                {this.props.tempQuestion ? <Fragment></Fragment> : a}
                {this.props.tempQuestion ? <Fragment></Fragment> : span}

            </div>
        )
    }

    mcqForm = () => {
        var { numOfDis } = this.state
        var distructorsList = []
        for (let i = 0; i < numOfDis; i++) {

            distructorsList.push(this.distructor(i))
        }
        return (
            <form id="reused_form" onSubmit={this.addQuestion}>
                <div className="levels">
                    <input type="text" className="form-control bg-light  small inputSearch" style={{ "marginBottom": "20px" }} placeholder="The Answer"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.keyword} onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                </div>

                <p style={{ "margin-bottom": "20px", "textAlign": "center" }}>
                    You dont have to add all distructors!
                </p>

                <div className="distructors">
                    {distructorsList}

                </div>
                <div class="row">
                    <div class="col-sm-12 form-group">
                        <input type="submit" class=" btn-success btn btn-lg btn-block" value={this.props.Question || this.props.tempQuestion ? "Edit" : "Add"} />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////MCQ Functions////////////////////////////////
    //////////////////////////TrueOrFalse////////////////////////////////



    TrueOrFalseForm = () => {
        return (
            <form id="reused_form" onSubmit={this.addQuestion}>
                <div class="col-sm-12 form-group levels">
                    <p>
                        <label class="margin radio-inline trueorfalse" id={this.props.index ? "trueChoose" + this.props.index : "trueChoose"} style={this.state.state ? { "color": "#4e73df" } : { "color": "black" }}>
                            <input type="radio" name="state" onChange={(e) => {
                                // console.log("e.target.value: ", e.target.value)
                                this.setState({ state: true })
                                $(".trueorfalse").css("color", "black")
                                $("#trueChoose" + this.props.index).css("color", "#4e73df")
                                if (this.props.tempQuestion) {
                                    let Question = this.state.Question
                                    let keyword = this.state.keyword
                                    let distructor = this.state.distructorsValue[0]
                                    // console.log(Question,keyword,distructor)
                                    Question = Question.replace(distructor, keyword)
                                    this.setState({
                                        Question
                                    })
                                }

                            }} value={true} />
                            True
                        </label>

                        <label class="margin radio-inline trueorfalse" id={this.props.index ? "falseChoose" + this.props.index : "falseChoose"} style={this.state.state ? { "color": "black" } : { "color": "#4e73df" }}>
                            <input type="radio" name="state" onChange={(e) => {
                                // console.log("e.target.value: ", typeof(e.target.value))

                                this.setState({ state: false })
                                $(".trueorfalse").css("color", "black")
                                $("#falseChoose" + this.props.index).css("color", "#4e73df")
                                if (this.props.tempQuestion) {
                                    let Question = this.state.Question
                                    let keyword = this.state.keyword
                                    let distructor = this.state.distructorsValue[0]
                                    // console.log(Question,keyword,distructor)

                                    Question = Question.replace(keyword, distructor)
                                    this.setState({
                                        Question
                                    })
                                }

                            }} value={false} />
                            False
                        </label>
                    </p>
                </div>
                <div className="distructors">
                    <input type="text" className="form-control bg-light  small " style={{ "marginBottom": "20px" }} placeholder="Keyword"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.keyword} onChange={(e) => {
                            let keyword = this.state.keyword
                            let Question = this.state.Question
                            if (e.target.value.length > 0) {
                                if (this.props.tempQuestion1) {
                                    if (this.state.state == true) {
                                        Question = Question.replace(keyword, e.target.value)
                                        this.setState({
                                            Question
                                        })
                                    }
                                }
                                this.setState({
                                    keyword: e.target.value,
                                })
                            }
                            else {
                                if (this.props.tempQuestion1) {
                                    if (this.state.state == true) {
                                        Question = Question.replace(keyword, "keyword")
                                        this.setState({
                                            Question
                                        })
                                    }
                                    this.setState({
                                        keyword: "keyword",
                                    })
                                }
                                else {
                                    this.setState({
                                        keyword: e.target.value,
                                    })
                                }

                            }


                        }} />
                    <input type="text" className="form-control bg-light  small " style={{ "marginBottom": "20px" }} placeholder="Distructor"
                        aria-label="Search" aria-describedby="basic-addon2" value={this.state.distructorsValue[0]} onChange={(e) => {
                            let { distructorsValue } = this.state
                            let Question = this.state.Question
                            if (e.target.value.length > 0) {
                                if (this.props.tempQuestion1) {
                                    if (this.state.state == false) {
                                        Question = Question.replace(distructorsValue[0], e.target.value)
                                        this.setState({
                                            Question
                                        })
                                    }

                                }
                                distructorsValue[0] = e.target.value
                                this.setState({
                                    distructorsValue,
                                })
                            }
                            else {
                                if (this.props.tempQuestion1) {
                                    if (this.state.state == false) {
                                        Question = Question.replace(distructorsValue[0], "distructor")
                                        this.setState({
                                            Question
                                        })
                                    }

                                    distructorsValue[0] = "distructor"
                                    this.setState({
                                        distructorsValue,
                                    })
                                }
                                else {
                                    distructorsValue[0] = e.target.value
                                    this.setState({
                                        distructorsValue,
                                    })
                                }

                            }




                        }} />
                </div>


                <div class="row">
                    <div class="col-sm-12 form-group">
                        <input type="submit" class=" btn-secondary btn btn-lg  btn-block" value={this.props.Question || this.props.tempQuestion ? "Edit" : "Add"} />
                    </div>
                </div>
            </form>
        )
    }

    //////////////////////////TrueOrFalse////////////////////////////////
    //////////////////////////Public Finctions////////////////////////////////

    formContent = () => {
        var { QuestionType } = this.state
        if (QuestionType == "MCQ") {
            $("#MCQ").click()
            return this.mcqForm()
        }
        else if (QuestionType == "Complete") {
            $("#Complete").click()
            return this.completeForm()
        }
        else {
            $("#trueorfalse").click()
            return this.TrueOrFalseForm()

        }
    }

    changeForm = (e) => {
        this.setState({
            QuestionType: e.target.value
        })
    }

    addPublic = (e) => {
        let p = true
        if (e.target.value == "true") {
            p = true
        }
        else {
            p = false
        }
        // console.log("e.target.value: ", typeof (p))

        this.setState({
            public: p
        })
        $(".public111").css("color", "black")
        // console.log(e.target.value)
        if (e.target.value == "true") {
            // console.log("true")
            $("#public" + this.props.index).css("color", "#4e73df")
        }
        else {
            // console.log("false")
            $("#private" + this.props.index).css("color", "#4e73df")
        }


    }

    selectLevel = (e) => {
        console.log("LEVEL: ", e.target.value)
        this.setState({
            level: e.target.value
        })
        $(".level11").css("color", "black")
        $("#" + e.target.value + this.props.index).css("color", "#4e73df")
    }

    addQuestion = async (e) => {
        e.preventDefault()
        let api1;
        var { level } = this.state
        var { Question } = this.state
        var { keyword } = this.state
        var { state } = this.state
        let Publication = this.state.public
        var { distructorsValue } = this.state
        var { DomainName } = this.state
        var { QuestionType } = this.state
        console.log(Publication)
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
        else if (Publication == "none") {
            $.alert({
                title: 'Error!',
                content: 'Choose if public or private!',
                buttons: {
                    okay: function () { },
                }
            });
        }
        else if (level == "") {
            $.alert({
                title: 'Error!',
                content: 'Choose Question level!',
                buttons: {
                    okay: function () { },
                }
            });
        }
        else if (distructorsValue.length < 1 && QuestionType != "Complete") {
            $.alert({
                title: 'Error!',
                content: 'Enter at least one Distructor',
                buttons: {
                    okay: function () { },
                }
            });
        }
        else if (this.props.Question) {
            let { removeOldDistructors } = this.state
            let { addNewDistructors } = this.state
            let { editedDistructors } = this.state
            let oldDistructors = []
            let newDistructors = []
            console.log("editedDistructors: ", editedDistructors)

            let keys = Object.keys(editedDistructors)
            for (let i = 0; i < keys.length; i++) {
                oldDistructors[i] = keys[i]
                newDistructors[i] = editedDistructors[oldDistructors[i]]
            }
            if (oldDistructors.length == 0) {
                oldDistructors = ""
            }
            if (newDistructors.length == 0) {
                newDistructors = ""
            }
            if (addNewDistructors.length == 0) {
                addNewDistructors = ""
            }
            if (removeOldDistructors.length == 0) {
                removeOldDistructors = ""
            }

            // console.log("QuestionID: ", QuestionID)
            console.log("---------------------------------------")
            console.log("Question: ", Question)
            console.log("oldDistractor: ", oldDistructors)
            console.log("newDistractor: ", newDistructors)
            console.log("addNewDistractor: ", addNewDistructors)
            console.log("removeOldDistractor: ", removeOldDistructors)
            console.log("keyword: ", keyword)
            console.log("public: ", Publication)
            console.log("---------------------------------------")
            if (Publication == "false" || Publication == false) {
                Publication = false
            }
            else {
                Publication = true
            }
            const requestOptions1 = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                body: JSON.stringify({
                    "Question": Question,
                    "NewDistructor": newDistructors,
                    "OldDistructor": oldDistructors,
                    "AddNewDistructor": addNewDistructors,
                    "RemoveOldDistructor": removeOldDistructors,
                    "keyword": keyword,
                    "public": Publication

                })
            };
            try {
                api1 = await fetch(this.props.url, requestOptions1)
                let data = await api1.json();
                let message = data.massage
                console.log(data)
                let index = this.props.index
                let editRenderdQuestion = this.props.editRenderdQuestion

                let { distructorsValue } = this.state
                let { keyword } = this.state
                let Question1 = this.state.Question
                let Q = this.props.Question
                let oldQuestion = {}
                let oldPublic = this.props.Question.public
                oldQuestion.distructor = distructorsValue
                oldQuestion.keyword = keyword
                oldQuestion.Question = Question1
                oldQuestion.public = Publication
                oldQuestion.Level = Q.Level
                oldQuestion.kind = Q.kind
                oldQuestion.owner = Q.owner
                oldQuestion.domain = Q.domain
                oldQuestion.time = Q.time
                oldQuestion._id = Q._id
                if (Q.kind == "T/F") {
                    oldQuestion.state = Q.state
                }

                let newOrNot = false
                if (oldPublic == true && Publication == false) {
                    newOrNot = true
                    // oldQuestion.public = true
                }
                console.log(api1.status)
                if (api1.status == 202) {
                    let index = this.props.index
                    const Question = oldQuestion
                    let ex = []
                    for (let i = 0; i < Question.distructor.length; i++) {
                        ex.push(Question.distructor[i])
                    }
                    let old = []
                    for (let i = 0; i < Question.distructor.length; i++) {
                        old.push(Question.distructor[i])
                    }
                    this.setState({
                        Question: Question.Question,
                        QuestionType: Question.kind,
                        public: Question.public ? true : false,
                        numOfDis: Question.distructor.length,
                        existedLength: Question.distructor.length,
                        distructorsValue: old,
                        existedDistructors: ex,
                        state: Question.state ? Question.state : true,
                        level: Question.Level,
                        DomainName: Question.domain.domain_name,
                        keyword: Question.keyword,
                        editedDistructors: {},
                        addNewDistructors: [],
                        removeOldDistructors: [],
                    })
                    $.alert({
                        title: 'Success!',
                        boxWidth: '400px',
                        useBootstrap: false,
                        content: "Question Updated",
                        buttons: {
                            okay: () => {
                                editRenderdQuestion(oldQuestion, newOrNot)

                                $("#closeModal").click()

                            },
                        }
                    });
                }
                else {
                    $.alert({
                        title: 'ُError!',
                        boxWidth: '400px',
                        useBootstrap: false,
                        content: message,
                        buttons: {
                            okay: function () {

                                // editRenderdQuestion(oldQuestion)

                                $("#closeModal").click()

                            },
                        }
                    });
                }
            }
            catch (e) {
                console.log(e)
            }

        }

        else if (this.props.tempQuestion) {
            if (this.props.QuestionType == "MCQ") {
                this.props.editRenderdQuestion(this.props.index, this.state.Question, this.state.keyword, this.state.distructorsValue, this.state.public, this.state.level)
            }
            else if (this.props.QuestionType == "trueorfalse") {
                this.props.editRenderdQuestion(this.props.index, this.state.Question, this.state.keyword, this.state.distructorsValue, this.state.public, this.state.level, this.state.state)
            }
            else {
                this.props.editRenderdQuestion(this.props.index, this.state.Question, this.state.keyword, this.state.public, this.state.level)
            }
            $("#closeModal").click()
        }

        else {

            const requestOptions1 = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                body: JSON.stringify({
                    "Level": level,
                    "Question": Question,
                    "keyword": keyword,
                    "state": state,
                    "public": Publication,
                    "add_distructors": distructorsValue,
                    "domain_name": DomainName
                })
            };


            try {

                if (QuestionType == "MCQ") {
                    QuestionType = "mcq"
                }
                else if (QuestionType == "Complete") {
                    QuestionType = "complete"
                }
                console.log(QuestionType, level, Question, keyword, distructorsValue, DomainName, Publication)
                api1 = await fetch('https://quizly-app.herokuapp.com/question/add/' + QuestionType, requestOptions1)
                console.log(api1.status)
                let data = await api1.json();


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
                                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") },
                                    body: JSON.stringify({
                                        "Level": level,
                                        "Question": Question,
                                        "keyword": keyword,
                                        "state": state,
                                        "add_distructors": distructorsValue,
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
                    if (QuestionType != "complete") {
                        data.distructor.forEach(element => {
                            distrators.push(element.distructor)
                        });
                        data.distructor = distrators
                    }
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
                            okay: () => {
                                this.setState({
                                    QuestionType: "MCQ",
                                    public: "none",
                                    numOfDis: 1,
                                    distructorsValue: [],
                                    state: 'true',
                                    level: "",
                                    domains: [],
                                    DomainName: "SW",
                                    keyword: "",
                                    Question: "",
                                    random: 0,

                                    editedDistructors: {},
                                    existedLength: 0,
                                    existedDistructors: [],
                                    oldDistructors: "",
                                    newDistructors: "",
                                    addNewDistructors: [],
                                    removeOldDistructors: [],
                                })
                            },
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
                    <h2 className="center">{this.props.Question || this.props.tempQuestion ? "Edit Question" : "Add Question"}</h2>
                    <div class="row" id={"QuestionsType" + this.props.index}>
                        <div class="col-sm-12 form-group levels">
                            <p>
                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id={"MCQ"} onChange={this.changeForm} value="MCQ" />
                                    MCQ
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id={"trueorfalse"} onChange={this.changeForm} value="trueorfalse" />
                                    TrueOrFalse
                                </label>

                                <label class="margin radio-inline">
                                    <input type="radio" name="QuestionType" id={"Complete"} onChange={this.changeForm} value="Complete" />
                                    Complate
                                </label>
                            </p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group levels">
                            <p>
                                <label class="margin radio-inline public111" id={this.props.index ? "private" + this.props.index : "private"}>
                                    <input type="radio" name="public" onChange={this.addPublic} value={false} />
                                    Private
                                </label>

                                <label class="margin radio-inline public111" id={this.props.index ? "public" + this.props.index : "public"}>
                                    <input type="radio" name="public" onChange={this.addPublic} value={true} />
                                    Public
                                </label>
                            </p>
                        </div>
                    </div>
                    <div className="row levels" id={"domains" + this.props.index}>
                        <span style={{ "margin": "auto 0", "height": "30px" }}>Domain: </span>
                        <select data-menu id="QuestionType" className="select1" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                            {ListDomains}

                        </select >
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group levels">
                            <p>
                                <label class="margin radio-inline level11" id={this.props.index ? "easy" + this.props.index : "easy"}>
                                    <input type="radio" name="level" onChange={this.selectLevel} value="easy" />
                                    easy
                                </label>

                                <label class="margin radio-inline level11" id={this.props.index ? "medium" + this.props.index : "medium"}>
                                    <input type="radio" name="level" onChange={this.selectLevel} value="medium" />
                                    medium
                                </label>

                                <label class="margin radio-inline level11" id={this.props.index ? "hard" + this.props.index : "hard"}>
                                    <input type="radio" name="level" onChange={this.selectLevel} value="hard" />
                                    hard
                                </label>
                            </p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-12 form-group">
                            {/* <textarea class="addQuestionText" type="textarea" name="comments" id="comments" placeholder="Your Question" maxLength="6000" rows="7" onBlur={(e) => { console.log(this.state.Question); this.setState({ Question: e.target.value }) }} ></textarea> */}
                            <textarea class="addQuestionText" autoFocus onFocus={(e) => { e.target.select() }} type="text" value={this.state.Question} onChange={(e) => this.setState({ Question: e.target.value })} />
                        </div>
                    </div>

                    {formContent}

                </div>
            </div>
        )
    }
}

export default AddingQuestion;