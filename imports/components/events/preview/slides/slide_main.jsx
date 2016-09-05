import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class SlideMain extends Component {

  constructor(props){
    super(props);
    this.state = {
      activeSlide: 0,
      tocActive: false
    }
  }

  render() {
    return (
      <div className="col-1 col" style={{position: "relative"}}>
        { this.props.slides[this.state.activeSlide].component }
        {
          this.state.tocActive ? (
            <div className="toc col">
              <div className="row" style={{padding: 20, justifyContent: "flex-end"}}>
                <FontAwesome name="times" size="2x" style={{alignSelf: "flex-end"}} onClick={() => { this.setState({tocActive: false}) }} />
              </div>
              {
                this.props.slides.map((slide, index) => {
                  return (
                    <div className={`toc-item ${index == this.state.activeSlide ? "active" : ""}`} onClick={() => { this.setState({activeSlide: index}) }}>
                      <span>{slide.name}</span>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className="toc row center x-center" onClick={() => { this.setState({tocActive: true}) }}>
              <div style={{padding: 20}}>
                <FontAwesome name="bars" size="2x" />
              </div>
            </div>
          )
        }
        {
          this.state.activeSlide > 0 ? (
            <div className="slide-page-left">
              <div className="slide-control" onClick={() => { this.setState({ activeSlide: this.state.activeSlide - 1 }) }}>
                <FontAwesome name="chevron-left" size="2x" />
              </div>
            </div>
          ) : (
            ""
          )
        }
        {
          this.state.activeSlide < this.props.slides.length - 1 ? (
            <div className="slide-page-right">
              <div className="slide-control" onClick={() => { this.setState({ activeSlide: this.state.activeSlide + 1 }) }}>
                <FontAwesome name="chevron-right" size="2x" />
              </div>
            </div>
          ) : (
            ""
          )
        }

      </div>
    )
  }
}
