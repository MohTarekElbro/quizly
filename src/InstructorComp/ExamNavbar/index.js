import React from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import './style.css'

class ExamNavbar extends React.Component {
    componentDidMount(){
        $(".toggle").on("click", function() {
            if ($(".ExamItem").hasClass("active")) {
                $(".ExamItem").removeClass("active");
                $(this).find("a").html("<i class='fas fa-bars'></i>");
            } else {
                $(".ExamItem").addClass("active");
                $(this).find("a").html("<i class='fas fa-times'></i>");
            }
        });
        $('.ExamItem').on('click' , function(){
            if ($(".ExamItem").hasClass("active")){
                $(".ExamItem").removeClass("active");
                $(".toggle").find("a").html("<i class='fas fa-bars'></i>");
            }
        })
    }
    render() {
        return (
            <div className="ho">
                <nav className="ExamNav">
                        <ul className="ExamMenu">
                            <li className="ExamItem" data-scroll="features"><a onClick = {() => this.props.changeToolContent("addingNewQuestion")} >AddNewQuestion</a></li>
                            <li className="ExamItem" data-scroll="review"><a onClick = {() => this.props.changeToolContent("myQuestions")} >MyQuestions</a></li>
                            <li className="ExamItem" data-scroll="contact"><a onClick = {() => this.props.changeToolContent("questionBank")} >QuestionBank</a></li>
                            <li className="ExamItem" data-scroll="contact"><a  >GenerateQuestions</a></li>
                            <li className="toggle"><a><i className="fas fa-bars"></i></a></li>
                        </ul>
                    
                </nav>
            </div>
        )
    }
}


export default ExamNavbar;