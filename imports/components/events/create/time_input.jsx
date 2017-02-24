import React, { Component } from 'react';
import moment from 'moment';

export default class TimeInput extends Component {

  constructor(props) {
    super(props);
    var obj = {
      hour: "12",
      minute: "00",
      half: "AM"
    }
    if(props.init) {
      var current = moment(props.init);
      obj = {
        hour: parseInt(current.format("h")),
        minute: parseInt(current.format("mm")),
        half: current.format("A")
      }
    }
    this.state = obj;
  }

  componentWillReceiveProps(next) {
    if(next.init) {
      var current = moment(next.init);
      obj = {
        hour: parseInt(current.format("h")),
        minute: parseInt(current.format("mm")),
        half: current.format("A")
      }
      this.state = obj;
      this.forceUpdate();
    }
  }

  onChange() {
    if(this.props.onChange){
      this.props.onChange(this.value());
    }
  }

  value() {
    var hour = parseInt(this.refs.hours.value);
    if(hour == 12 && this.refs.half.value == "AM") {
      hour = 0;
    }
    else if(hour < 12 && this.refs.half.value == "PM") {
      hour += 12;
    }
    if(hour < 10) {
      hour = "0" + hour;
    }
    var minutes = parseInt(this.refs.minutes.value);
    if(minutes < 10) {
      minutes = "0" + minutes;
    }
    return {
      hour, minutes
    };
  }

  render() {
    var [hours, minutes] = [[], []];
    for(var i = 1; i <= 12; i ++){
      hours.push(i);
    }
    for(var i = 0; i < 60; i += 5){
      minutes.push(i);
    }
    return (
      <div style={this.props.style || {}}>
        <div className="time-input row center x-center">
          <select ref="hours" defaultValue={this.state.hour} onChange={this.onChange.bind(this)}>
            {
              hours.map((hour) => {
                return (
                  <option value={hour}>
                    { hour }
                  </option>
                );
              })
            }
          </select>
          <span style={{margin: "0 10px"}}>
            :
          </span>
          <select ref="minutes" style={{marginRight: 10}} defaultValue={this.state.minute} onChange={this.onChange.bind(this)}>
            {
              minutes.map((value) => {
                return (
                  <option value={value}>
                    { value < 10 ? "0" + value : value }
                  </option>
                )
              })
            }
          </select>
          <select ref="half" defaultValue={this.state.half} onChange={this.onChange.bind(this)}>
            <option value={"AM"}>AM</option>
            <option value={"PM"}>PM</option>
          </select>
        </div>
      </div>
    )
  }
}
