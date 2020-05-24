import React, { Component } from 'react'
import './style.css'
import { read_cookie } from 'sfcookies';
import { Ouroboro } from 'react-spinners-css';
import $ from 'jquery'
// value={this.state.search} onChange={(e) => { this.setState({ search: e.target.value }) }}
class GenerteQuestions extends Component {
    state = {
        QuestionType: "mcq",
        public: "false",
        numOfDis: 1,
        distractorsValue: [],
        state: 'true',
        level: "medium",
        domains: [],
        DomainName: "Software Engineering",
        keyword: "",
        Question: "",
        screen: "loading"

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
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                                    <option value={"mcq"}>MCQ</option>
                                    <option value={"trueorfalse"}>TrueOrFalse</option>
                                    <option value={"complete"}>Complete</option>
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
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                                    <option value={"H"}>Hard</option>
                                    <option value={"M"}>Medium</option>
                                </select >
                            </div>

                            <div className=" levels">
                                <span style={{ "margin": "auto 0", "height": "30px" }}>Num of Answers: </span>
                                <select data-menu id="QuestionType" className="select2" name="QuestionType" value={this.state.DomainName} onChange={(e) => { this.setState({ DomainName: e.target.value }) }} >
                                    <option value={2}>{2}</option>
                                    <option value={3}>{3}</option>
                                    <option value={4}>{4}</option>
                                    <option value={5}>{5}</option>
                                </select >
                            </div>
                        </div>

                        <div className="options">
                            <p onClick={() => this.changeOption("textarea")} style={{
                                'font-weight': 'bold',
                                'font-size': '17px'
                            }} className="option" id="textareaItem">Wirte in Text</p>
                            <div className="line"></div>
                            <p onClick={() => this.changeOption("uploadInput")} className="option" id="uploadInputItem" >Upload Txt file</p>

                        </div>


                        <div class="row optionItem" id="textarea">
                            <div class="col-sm-12 form-group">
                                <textarea class="generateQuestionText" type="textarea" name="comments" id="comments" placeholder="Your Question" maxLength="6000" rows="7" onBlur={(e) => { console.log(this.state.Question); this.setState({ Question: e.target.value }) }} ></textarea>
                            </div>
                        </div>
                        <div className="uploadTxtFile remove optionItem" id="uploadInput">
                            <label className="custom-file-upload" style={{ "marginTop": "0px" }}>
                                <input type="file" name='instructorPic' ref={(instructorPic) => { this.instructorPic = instructorPic }} className="fileInput form-control" />
                                <i className="fas fa-upload"></i> Upload File
                        </label>
                        </div>


                    </div>
                </div>
            )
        }
        else if (screen == "loading") {
            return (
                <div className="loading">
                    <div>
                        <h2>Wati for generating questions...</h2>
                        <Ouroboro color="#be97e8" />
                    </div>
                </div>
            )
        }

    }


    changeOption = (id) => {
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

    render() {
        $(".generateQuestionText").on('input', function () {
            var scroll_height = $(".generateQuestionText").get(0).scrollHeight;
            console.log(scroll_height)

            $(".generateQuestionText").css('height', scroll_height + 2 + 'px');
        });
        return (
            this.renderScreen()
        )
    }
}
export default GenerteQuestions