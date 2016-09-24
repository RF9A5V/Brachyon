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
        half: current.format("A")
      }
    }

    this.setState(obj);
  }

  hourChange(e) {
    var val = parseInt(this.state.hour + e.key);
    if(!isNaN(val)){
      if(val > 12){
        if(e.key == '0'){
          return;
        }
        this.state.hour = "0" + e.key;
      }
      else {
        this.state.hour = val + "";
      }
    }
    if(this.props.onChange != null){
      this.props.onChange();
    }
    this.forceUpdate();
  }

  minuteChange(e){
    var val = parseInt(this.state.minute + e.key);
    if(!isNaN(val)){
      if(val > 59){
        this.state.minute = "0" + e.key;
      }
      else {
        this.state.minute = (val < 10 ? ("0" + val) : ("" + val));
      }
    }
    if(this.props.onChange != null){
      this.props.onChange();
    }
    this.forceUpdate();
  }

  halfChange(e) {
    if(e.key == 'a'){
      this.state.half = "AM";
    }
    else if(e.key == 'p'){
      this.state.half = "PM";
    }
    if(this.props.onChange != null){
      this.props.onChange();
    }
    this.forceUpdate();
  }

  value() {
    var hour = parseInt(this.refs.hours.value);
    if(this.refs.half.value == "am" && hour == 12) {
      hour = 0;
    }
    if(this.refs.half.value == "pm") {
      if(hour != 12){
        hour = (hour + 12) % 24;
      }
    }
    return this.refs.hours.value + ":" + this.refs.minutes.value;
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
          <select ref="half">
            <option value={"am"}>AM</option>
            <option value={"pm"}>PM</option>
          </select>
        </div>
      </div>
    )
  }
}
