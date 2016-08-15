import React, { Component } from "react";

export default class SliderContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      barPositions: [0, 0]
    }
  }

  onSliderBarDrag(index) {
    return (e) => {
      var mousePos = e.nativeEvent.clientX;
      if(mousePos == 0) {
        return;
      }
      var leftOffset = document.getElementById("track").getBoundingClientRect().left;
      var diff = mousePos - leftOffset;
      if(diff < 0) {
        diff = 0;
      }
      else if(diff > 250) {
        diff = 250;
      }
      for(var i = 0; i < this.state.barPositions.length; i ++){
        if(i == index) {
          continue;
        }
        this.state.barPositions[i] = (250 - diff) / (this.state.barPositions.length - 1);
      }
      this.state.barPositions[index] = diff;
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="col">
      {
        this.state.barPositions.map((value, index) => {
          return (
            <div className="slider-container" key={index}>
              <div className="slider-bar row flex-pad" id="bar" ref="bar" onDrag={this.onSliderBarDrag(index).bind(this)} style={{left: this.state.barPositions[index] }}>
                <div className="slider-decoration"></div>
                <div className="slider-decoration"></div>
                <div className="slider-decoration"></div>
              </div>
              <div className="slider-track" id="track" ref="track">
              </div>
            </div>
          )
        })
      }
      </div>
    )
  }
}
