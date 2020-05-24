import React, { Component } from 'react'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { SliderRail, Handle, Track, Tick } from '../sliderComps'

class Range extends Component{
    state = {
        domain: [0, 240],
        values: [0, 140].slice(),
        update: [0, 140].slice(),
        reversed: false,
    }

    
}
