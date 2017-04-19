import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";
import { browserHistory } from "react-router";
import Slider from "react-slick";

import SubSlideContainer from "./sub_slide.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class SlideMain extends ResponsiveComponent {

  constructor(props){
    super(props);
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.state = {
      activeSlide: Math.max(slideIndex, 0)
    }
  }

  componentWillReceiveProps(props) {
    var slideIndex = props.slides.findIndex(o => { return o.name.toLowerCase() == props.slide });
    this.setState({
      activeSlide: Math.max(slideIndex, 0),
      activeSub: 0
    });
  }

  navElements(opts) {
    return this.props.slides.map((slide, index) => {
      var style = {
        backgroundColor: this.state.activeSlide == index ? (this.props.color || "transparent") : "transparent",
        fontWeight: "bold",
        fontSize: opts.navSize,
        padding: opts.navPad
      }
      return (
        <div className={`preview-nav col-1 ${this.state.activeSlide == index ? "active" : ""} ${this.props.color == "#FF6000" ? "orange" : "blue"}`} style={style} onClick={() => {
          this.refs.slider.slickGoTo(index);
        }}>
          {
            opts.useIcons ? (
              <FontAwesome name={slide.icon} />
            ) : (
              <span>
                {
                  slide.name.toUpperCase()
                }
              </span>
            )
          }
        </div>
      )
    });
  }

  setMain(i) {
    this.refs.slider.slickGoTo(i)
  }

  setCurrent(i) {
    this.refs[this.state.activeSlide].setCurrent(i);
  }

  renderBase(opts) {
    var current = this.props.slides[this.state.activeSlide];
    return (
      <div>
        <Slider dots={false} initialSlide={this.state.activeSlide} infinite={false} arrows={false} style={{display: "flex"}} ref="slider" afterChange={(current) => {
          window.history.pushState(null, null, this.props.baseUrl + this.props.slides[current].name.toLowerCase());
          this.state.activeSlide = current;
          this.forceUpdate();
        }} draggable={false} slidesToScroll={1}>
          {
            this.props.slides.map((item, i) => {
              return (
                <div className="slide">
                  <SubSlideContainer items={item.slides} ref={i} onAnimDone={this.forceUpdate.bind(this)} backgroundImage={this.props.backgroundImage || null} pages={this.props.pages} />
                </div>
              )
            })
          }
        </Slider>
        {
          current.slides.length > 1 ? (
            <div className="slide-controller" style={{top: opts.sideNavTop, bottom: opts.sideNavBottom}}>
              {
                current.slides.map((item, i) => {
                  var icon;
                  var currentRef = this.refs[this.state.activeSlide];
                  if(currentRef) {
                    currentRef = currentRef.getCurrent();
                  }
                  else {
                    currentRef = 0;
                  }
                  if(!item.icon) {
                    icon = (
                      <div className={`slide-controller-tab icon`} onClick={() => {
                        this.refs[this.state.activeSlide].setCurrent(i)
                      }} style={{
                        width: opts.sideNavSize,
                        height: opts.sideNavSize
                      }}>
                        <div className={`content ${i == currentRef ? "active" : ""}`} style={{
                          backgroundColor: this.props.color || "white"
                        }}>
                        </div>
                      </div>
                    )
                  }
                  else {
                    icon = (
                      <FontAwesome name={item.icon} className={`slide-controller-tab ${i == this.state.activeSub ? "active" : ""}`} onClick={() => {
                        this.refs[this.state.activeSlide].setCurrent(i);
                      }} />
                    )
                  }
                  return icon;
                })
              }
            </div>
          ) : (
            <div></div>
          )
        }
        <div className="row x-center" style={{position: "fixed", bottom: 0, width: "100%", backgroundColor: "#111", zIndex: 4}}>
          {
            this.navElements(opts)
          }
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      navSize: "1.2em",
      navPad: 13.5,
      useIcons: false,
      sideNavSize: "1em",
      sideNavTop: "calc(50vh - 50px)",
      sideNavBottom: null
    });
  }

  renderMobile() {
    return this.renderBase({
      navSize: "7rem",
      navPad: 30,
      useIcons: true,
      sideNavSize: "3em",
      sideNavTop: null,
      sideNavBottom: "140px"
    });
  }
}
