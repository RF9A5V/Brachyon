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

  render() {
    return (
      <Slider arrows={false} autoplay={false} dots={false} vertical={true} verticalSwiping={true} infinite={false} afterChange={
        (current) => {
          this.props.onAnimDone(current);
        }
      } ref="slider">
      {
        this.props.items.map((item, i) => {
          return (
            <div>
              <div className="slide" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.backgroundImage()})`}}>
                <item.component {...item.args} />
              </div>
            </div>
          )
        })
      }
      </Slider>
    )
  }
}
