import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";
import { browserHistory } from "react-router";
import Swipeable from "react-swipeable";

import SubSlideContainer from "./sub_slide.jsx";

export default class SlideMain extends Component {

  constructor(props){
    super(props);
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.state = {
      activeSlide: Math.max(slideIndex, 0)
    }
  }

  componentDidMount() {
    this.refs.container.scrollLeft = window.innerWidth * this.state.activeSlide;
    console.log(window.innerWidth * this.state.activeSlide);
    console.log(this.refs.container.scrollLeft);
  }

  componentWillReceiveProps(props) {
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.refs.container.scrollLeft = window.innerWidth * slideIndex;
    console.log(window.innerWidth * slideIndex);
    console.log(this.refs.container.scrollLeft);
    this.setState({
      activeSlide: Math.max(slideIndex, 0)
    });
  }

  navElements() {
    var slides = this.props.slides.map((slide, index) => {
      return (
        <div className={`preview-nav ${this.state.activeSlide == index ? "active" : ""}`} onClick={() => { browserHistory.push(this.props.baseUrl + slide.name.toLowerCase()) }}>
          { slide.name }
        </div>
      )
    });
    var elems = [];
    slides.forEach(elem => {
      elems.push(elem);
      elems.push(
        <div style={{fontSize: 16, fontWeight: "bold"}}>
          -
        </div>
      )
    });
    elems.pop();
    return elems;
  }

  onLeft() {
    console.log("left!");
  }

  onRight() {
    console.log("right!");
  }

  render() {
    return (
      <div>
        <Swipeable ref="container" onSwipedLeft={this.onLeft.bind(this)} onSwipedRight={this.onRight.bind(this)} trackMouse={true} style={{whiteSpace: "nowrap"}}>
          {
            this.props.slides.map(item => {
              return (
                <SubSlideContainer items={item.slides} />
              )
            })
          }
        </Swipeable>
        <div className="row x-center" style={{paddingLeft: 20, position: "fixed", bottom: 0, width: "100%", backgroundColor: "#111", height: 50, zIndex: 4}}>
          {
            this.navElements()
          }
        </div>
      </div>
    )
  }
}
