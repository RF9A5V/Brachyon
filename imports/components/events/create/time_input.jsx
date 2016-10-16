import React, { Component } from 'react';
import moment from 'moment';

export default class TimeInput extends Component {

  componentWillMount() {

    var obj = {
      hour: "12",
      minute: "00",
      half: "AM"
    }

    if(this.props.init){
      var current = moment(this.props.init);
      obj = {
        hour: current.format("hh"),
        minute: current.format("mm"),
        half: current.format("a")
      }
    }

    this.setState(obj);
  }

  value() {
    var hour = parseInt(this.refs.hours.value);
    if(hour == 12 && this.refs.half.value == "am") {
      hour = 0;
    }
    else if(hour < 12 && this.refs.half.value == "pm") {
      hour += 12;
    }
    if(hour < 10) {
      hour = "0" + hour;
    }
    var minutes = parseInt(this.refs.minutes.value);
    if(minutes < 10) {
      minutes = "0" + minutes;
    }
    console.log(hour + ":" + minutes);
    return hour + "" + minutes;
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
      <div>
        <div className="time-input">
          <select ref="hours" defaultValue={this.state.hour}>
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
          <select ref="minutes" style={{marginRight: 10}} defaultValue={this.state.minute}>
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
          <select ref="half" defaultValue={this.state.half}>
            <option value={"am"}>AM</option>
            <option value={"pm"}>PM</option>
          </select>
        </div>
      </div>
    )
  }
}
