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
    this.props.onChange();
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
    this.props.onChange();
    this.forceUpdate();
  }

  halfChange(e) {
    if(e.key == 'a'){
      this.state.half = "AM";
    }
    else if(e.key == 'p'){
      this.state.half = "PM";
    }
    this.props.onChange();
    this.forceUpdate();
  }

  value() {

    var hour = this.state.hour * 1;

    if(hour === 12 && this.state.half == "AM"){
      if(this.state.half == "AM"){
        hour = 0;
      }
      else {
        hour = 12;
      }
    }
    else {
      hour += ( this.state.half == "AM" ? 0 : 12 );
    }
    if(hour < 10){
      hour = "0" + hour;
    }
    return `${hour}:${this.state.minute}`
  }

  render() {
    return (
      <div>
        <div className="time-input">
          <input type="text" ref="hour" onKeyDown={this.hourChange.bind(this)} placeholder="Hour" value={this.state.hour} onChange={() => {}}/>
          :
          <input type="text" ref="minute" placeholder="Minute" value={this.state.minute} onKeyDown={this.minuteChange.bind(this)} onChange={() => {}} />
          <input type="text" ref="half" placeholder="AM/PM" value={this.state.half} onKeyDown={this.halfChange.bind(this)} onChange={() => {}} />
        </div>
      </div>
    )
  }
}
