import React from 'react';
import Navbar from './Navbar'
import Header from './Header'
import Features from './Features'
import Reviews from './Reviews'
import Contact from './Contact'
import Footer from './Footer'
import { withRouter } from 'react-router-dom';
import { Default } from 'react-spinners-css';



class Home extends React.Component {
  state = {
    token: "loading"
  }
  componentWillMount = async () => {

    if (localStorage.getItem("token")) {
      // window.addEventListener('scroll', this.handleScroll);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "token": localStorage.getItem("token")
        })
      };
      let api;
      try {
        api = await fetch('https://quizly-app.herokuapp.com/check', requestOptions)
        const data = await api.json();
        if (data.type == "instructor") {
          this.props.history.push("/instructorHome/generateExam")

        }
        else if (data.type == "admin") {
          this.props.history.push("/adminHome")

        }
        else {
          this.setState({
            token: "false"
          })
        }

      }
      catch (e) {
        this.setState({
          token: "false"
        })
        console.log("Error: ", e);
      }
    }
    else {
      this.setState({
        token: "false"
      })
    }
  }

  render() {
    if (this.state.token == "loading") {
      return (
        <div className="loading">
          <div>
            {/* <h2>Wait for generating questions...</h2> */}
            <Default color="#4e73df" />
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <Navbar />
          <Header />
          <Features />
          <Reviews />
          <Contact />
          <Footer />

        </div>
      );
    }
  }

}

export default withRouter(Home);
