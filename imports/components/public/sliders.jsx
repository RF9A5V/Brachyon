import React, { Component } from "react";

export default class SliderContainer extends Component {

  constructor(props) {
    super(props);
    for(var i in props.labels) {
      if(!props.labels[i].percentage) {
        props.labels[i].position = 0;
      }
      else {
        props.labels[i].position = props.labels[i].percentage * 400;
      }
    }
    if(props.labels[0].position == 0) {
      props.labels[0].position = 400;
    }
    this.state = {
      labels: props.labels
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
      var limit = 400;
      for(var i = 0; i < index; i ++) {
        limit -= this.state.labels[i].position;
      }
      if(diff < 0) {
        diff = 0;
      }
      else if(diff > limit) {
        diff = limit;
      }
      var dx = diff - this.state.labels[index].position;
      var rem = 0;
      for(var i = index + 1; i < this.state.labels.length; i ++) {
        rem += this.state.labels[i].position;
      }
      for(var i = index + 1; i < this.state.labels.length; i ++){
        if(rem == 0) {
          this.state.labels[i].position -= dx / (this.state.labels.length - 1);
        }
        else {
          this.state.labels[i].position -= dx * this.state.labels[i].position / rem;
          if(this.state.labels[i].position < 0){
            this.state.labels[i].position = 0;
          }
          if(this.state.labels[i].position > 400) {
            this.state.labels[i].position = 400;
          }
        }
      }
      this.state.labels[index].position = diff;
      this.forceUpdate();
    }
  }

  values() {
    return this.state.labels.map((labelObj) => {
      labelObj.percentage = labelObj.position / 400;
      delete labelObj.position;
      delete labelObj.name;
      return labelObj;
    })
  }

  render() {
    // TODO: Fix floating point precision errors.
    return (
      <div className="col">
      {
        this.state.labels.map((labelObj, index) => {
          var value = labelObj.position || 0;
          var percent = (Math.round(parseFloat((value * 100 / 400)) / 5) * 5)
          return (
            <div className="col" key={index}>
              <span>{ labelObj.name }</span>
              <div className="row x-center flex-pad">
                <span>{ percent }%</span>
                <span>
                  {
                    this.props.value != null ? (
                      `$${(this.props.value * percent / 100).toFixed(2)}`
                    ) : (
                      `$${(1000 * percent / 100).toFixed(2)}`
                    )
                  }
                </span>
              </div>
              <div className="slider-container">
                <div className="slider-bar row flex-pad" id="bar" ref="bar" onDrag={this.onSliderBarDrag(index).bind(this)} style={{left: value }}>
                  <div className="slider-decoration"></div>
                  <div className="slider-decoration"></div>
                  <div className="slider-decoration"></div>
                </div>
                <div className="slider-track" id="track" ref="track">
                </div>
              </div>
              {
                this.state.labels.length > 1 && this.state.labels[index].deletable ? (
                  <div>
                    <button onClick={this.props.onRemove(index)}>Delete This</button>
                  </div>
                ) : (
                  ""
                )
              }

            </div>
          )
        })
      }
      </div>
    )
  }
}
