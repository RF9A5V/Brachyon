import React, { Component } from 'react'

export default class TimeInput extends Component {

  componentWillMount() {
    this.setState({
      hour: "12",
      minute: "00",
      half: "AM"
    })
  }

  hourChange(e) {
    val = parseInt(this.state.hour + e.key);
    if(!isNaN(val)){
      if(val > 12){
        if(e.key == '0'){
          return;
        }
        this.setState({
          hour: e.key
        })
      }
      else {
        this.setState({
          hour: val + ""
        })
      }
    }
  }

  minuteChange(e){
    var val = parseInt(this.state.minute + e.key);
    if(!isNaN(val)){
      if(val > 59){
        this.setState({
          minute: "0" + e.key
        })
      }
      else {
        this.setState({
          minute: (val < 10 ? ("0" + val) : ("" + val))
        })
      }
    }
  }

  halfChange(e) {
    if(e.key == 'a'){
      this.setState({
        half: 'AM'
      })
    }
    else if(e.key == 'p'){
      this.setState({
        half: 'PM'
      })
    }
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
          <input type="text" ref="hour" onKeyDown={this.hourChange.bind(this)} placeholder="Hour" value={(parseInt(this.state.hour) < 10 ? "0" : "") + this.state.hour}/>
          :
          <input type="text" ref="minute" placeholder="Minute" value={this.state.minute} onKeyDown={this.minuteChange.bind(this)} />
          <input type="text" ref="half" placeholder="AM/PM" value={this.state.half} onKeyDown={this.halfChange.bind(this)} />
        </div>
      </div>
    )
  }
}
