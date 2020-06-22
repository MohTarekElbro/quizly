import React, { Component } from 'react'
import axios from 'axios'
import './style.css'

class Features extends Component {

    state = {
        features: [],
        shownFeature: 1
    }

    componentDidMount = () => {
        axios.get('js/data.json').then(res => {
            this.setState({ features: res.data.features })
        })
    }

    changeFeatures = (featureID) => {
        this.setState({
            shownFeature: featureID
        })
    }

    render() {

        const { features } = this.state;
        const { shownFeature } = this.state;




        const listFeatures = () => {
            return features.map((feature) => {
                if (feature.id === shownFeature) {
                    return (
                        <div key={feature.id} id="contents">
                            <h2 className = "featureTitle">{feature.title}</h2>
                            <p>{feature.content}</p>
                            <div className="downloadButton">Download</div>
                        </div>
                    )
                }
            })
        }


        const listTabs = features.map((feature) => {
            return (
                <div className={(shownFeature === feature.id) ? "active1" : ""} onClick={() => this.changeFeatures(feature.id)} key={feature.id}>tab {feature.id}</div>
            )
        })



        return (
            <div className="featuers block" id="features">
                <div className="container">
                    <div className="tabs">
                        {listTabs}
                    </div>

                    <div className="contents">
                        {listFeatures()}
                    </div>

                </div>
            </div>
        )
    }
}

export default Features;