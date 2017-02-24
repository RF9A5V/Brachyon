import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Slider from "react-slick";

export default class SubSlideContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentItem: 0,
      swiping: false
    };
  }

  backgroundImage() {
    return this.props.backgroundImage ? this.props.backgroundImage : "/images/bg.jpg";
  }

  setCurrent(i) {
    this.refs.slider.slickGoTo(i);
  }

  getCurrent() {
    return this.state.currentItem;
  }

  render() {
    return (
      <Slider arrows={false} autoplay={false} dots={false} vertical={true} verticalSwiping={true} infinite={false} afterChange={
        (current) => {
          this.state.currentItem = current;
          this.props.onAnimDone();
          this.state.swiping = false;
        }
      } ref="slider" draggable={false} slidesToScroll={1}>
      {
        this.props.items.map((item, i) => {
          return (
            <div onWheel={(e) => {
              if(this.state.swiping) {
                return;
              }
              if(e.deltaY > 0) {
                this.refs.slider.slickNext();
                this.state.swiping = true;
              }
              if(e.deltaY < 0) {
                this.refs.slider.slickPrev();
                this.state.swiping = true;
              }
            }}>
              <div className="slide" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.backgroundImage()})`}}>
                <item.component {...item.args} pages={this.props.pages} />
              </div>
            </div>
          )
        })
      }
      </Slider>
    )
  }
}
