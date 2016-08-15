import React, { Component } from "react";

export default class SliderContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      barPositions: [250, 0, 0, 0]
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
      var dx = diff - this.state.barPositions[index];
      var rem = 0;
      for(var i = 0; i < this.state.barPositions.length; i ++) {
        if(i == index) {
          continue;
        }
        rem += this.state.barPositions[i];
      }
      for(var i = 0; i < this.state.barPositions.length; i ++){
        if(i == index) {
          continue;
        }
        if(rem == 0) {
          this.state.barPositions[i] -= dx / (this.state.barPositions.length - 1);
        }
        else {
          this.state.barPositions[i] -= dx * this.state.barPositions[i] / rem;
          if(this.state.barPositions[i] < 0){
            this.state.barPositions[i] = 0;
          }
          if(this.state.barPositions[i] > 250) {
            this.state.barPositions[i] = 250;
          }
        }
      }
      this.state.barPositions[index] = diff;
      this.forceUpdate();
    }
  }

  render() {
    console.log(this.props.labels)
    return (
      <div className="col">
      {
        this.state.barPositions.map((value, index) => {
          return (
            <div className="col" key={index}>
              <div className="row x-center flex-pad">
                <span>{Math.round(value * 100 / 250)}%</span>
                <span>
                  {
                    this.props.value != null ? (
                      `$${(this.props.value * value / 250).toFixed(2)}`
                    ) : (
                      `$${(1000 * value / 250).toFixed(2)}`
                    )
                  }
                </span>
              </div>
              <div className="slider-container" key={index}>
                <div className="slider-bar row flex-pad" id="bar" ref="bar" onDrag={this.onSliderBarDrag(index).bind(this)} style={{left: this.state.barPositions[index] }}>
                  <div className="slider-decoration"></div>
                  <div className="slider-decoration"></div>
                  <div className="slider-decoration"></div>
                </div>
                <div className="slider-track" id="track" ref="track">
                </div>
              </div>
            </div>
          )
        })
      }
      </div>
    )
  }
}
