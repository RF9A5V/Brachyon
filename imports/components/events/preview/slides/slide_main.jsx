import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";
import { browserHistory } from "react-router";

export default class SlideMain extends Component {

  constructor(props){
    super(props);
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.state = {
      activeSlide: Math.max(slideIndex, 0),
      tocActive: false,
      isAnim: false,
      scrollAmount: 0
    }
  }

  componentWillReceiveProps(props) {
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.setState({
      isAnim: true
    }, () => {
      setTimeout(() => {
        this.setState({
          activeSlide: Math.max(slideIndex, 0),
          isAnim: false
        })
      }, 500)
    })

  }

  onSlideChange(index) {
    
    if(this.state.activeSlide == index) {
      return;
    }
    else {
      this.setState({
        isAnim: true
      });
      setTimeout(() => {
        this.setState({
          activeSlide: index,
          isAnim: false
        });
      }, 500)
    }
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

  pageIndexObj() {
    var obj = {};
    this.props.slides.forEach((slide, i) => {
      obj[slide.name] = i;
    });
    return obj;
  }

  currentComponent() {
    var slide = this.props.slides[this.state.activeSlide];
    return (
      <slide.component event={this.props.event} nav={this.onSlideChange.bind(this)} slides={this.pageIndexObj()} />
    )
  }

  render() {
    return (
      <div className="col-1 col" style={{position: "relative"}}>
        <VelocityComponent animation={{opacity: this.state.isAnim ? 0 : 1}} duration={500}>
          {
            this.currentComponent()
          }
        </VelocityComponent>
        {
          this.state.activeSlide > 0 ? (
            <div className="slide-control left" onClick={() => { this.onSlideChange(this.state.activeSlide - 1) }}>
              <FontAwesome name="chevron-left" size="2x" />
            </div>
          ) : (
            ""
          )
        }
        {
          this.state.activeSlide < this.props.slides.length - 1 ? (
            <div className="slide-control right" onClick={() => { this.onSlideChange(this.state.activeSlide + 1) }}>
              <FontAwesome name="chevron-right" size="2x" />
            </div>
          ) : (
            ""
          )
        }
        <div className="row x-center" style={{paddingLeft: 20, position: "fixed", bottom: 0, width: "100%", backgroundColor: "#111", height: 50, zIndex: 4}}>
          {
            this.navElements()
          }
        </div>
      </div>
    )
  }
}
