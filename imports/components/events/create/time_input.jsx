import React, { Component } from 'react'

export default class TimeInput extends Component {

  componentWillMount() {
    this.setState({
      hour: "",
      minute: "",
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
    val = parseInt(this.state.minute + e.key);
    if(!isNaN(val)){
      if(val > 59){
        this.setState({
          minute: e.key
        })
      }
      else {
        this.setState({
          minute: val + ""
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
    return this.state;
  }

  render() {
    return (
      <div className="time-input">
        <input type="text" ref="hour" onKeyDown={this.hourChange.bind(this)} placeholder="Hour" value={(parseInt(this.state.hour) < 10 ? "0" : "") + this.state.hour}/>
        :
        <input type="text" ref="minute" placeholder="Minute" value={(parseInt(this.state.minute) < 10 ? "0" : "") + this.state.minute} onKeyDown={this.minuteChange.bind(this)} />
        <input type="text" ref="half" placeholder="AM/PM" value={this.state.half} onKeyDown={this.halfChange.bind(this)} />
      </div>
    )
  }
}
