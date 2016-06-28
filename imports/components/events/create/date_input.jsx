import React, { Component } from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

export default class DateInput extends Component {

  componentWillMount() {
    this.setState({
      open: false,
      month: moment().format("M"),
      year: moment().format("YYYY"),
      day: moment().format("DD")
    })
  }

  value() {
    return this.stateTime().format("YYYYMMDD");
  }

  openCalendar() {
    this.setState({
      open: true
    })
  }

  closeCalendar() {
    this.setState({
      open: false,
      month: moment().format("M"),
      year: moment().format("YYYY"),
      day: moment().format("DD")
    })
  }

  stateTime() {
    return moment(new Date(this.state.year, parseInt(this.state.month) - 1, this.state.day));
  }

  days(num) {
    self = this;
    vals = [];
    nils = parseInt(moment(new Date(self.state.year, parseInt(self.state.month) - 1, 0)).format('e')) + 1;
    ar = [];
    for(var i = 0; i < nils; i++){
      ar.push("");
    }
    for(var i = 0; i < num;){
      while(ar.length < 7 && i < num){
        ar.push(++i);
      }
      vals.push(ar);
      ar = [];
    }
    return vals.map(function(array){
      return (
        <div className="calendar-days">
          {
            array.map(function(value){
              return (
                <div className="calendar-days-entry" onClick={self.setValue.bind(self)} style={ moment(new Date(self.state.year, parseInt(self.state.month) - 1, value)) < moment() ? {
                  color: '#999'
                } : {} } >
                  {value}
                </div>
              )
            })
          }
        </div>
      )
    })
  }

  setValue(e) {
    var cache = this.state.day;
    this.state.day = parseInt(e.target.innerText);
    console.log(this.stateTime());
    if(this.stateTime() < moment()){
      this.day = cache;
      return;
    }
    this.refs.value.value = this.stateTime().date(e.target.innerHTML).format("MM/DD/YYYY");
    this.closeCalendar();
  }

  prevMonth() {
    value = parseInt(this.state.month) - 1
    this.setState({
      month: `${(value + 12) % 12}`,
      year: `${parseInt(this.state.year) + Math.floor(value / 12)}`
    })
  }

  advanceMonth() {
    value = parseInt(this.state.month) + 1
    this.setState({
      month: `${value % 12}`,
      year: `${parseInt(this.state.year) + Math.floor(value / 12)}`
    })
  }

  calendar() {
    self = this;
    return (
      <div className='calendar'>
        <div style={{textAlign: 'right', padding: 5}}>
          <FontAwesome name="times" onClick={this.closeCalendar.bind(this)} />
        </div>
        <div className="calendar-month">
          <div ref="prevMonth" className="calendar-month-control" onClick={this.prevMonth.bind(this)}>
            <FontAwesome name="chevron-left" />
          </div>
          <div style={{textAlign: 'center'}}>
            { this.stateTime().format("MMMM") + " " + this.stateTime().format("YYYY") }
          </div>
          <div className="calendar-month-control" onClick={this.advanceMonth.bind(this)}>
            <FontAwesome name="chevron-right" />
          </div>
        </div>
        <div className="calendar-days">
          {
            ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"].map(function(val){
              return (
                <div className="calendar-days-entry">
                  { val }
                </div>
              );
            })
          }
        </div>
        {
          this.days((new Date(self.state.year, self.state.month, 0)).getDate())
        }

      </div>
    )
  }

  render() {
    return (
      <div className="calendar-container">
        <input type="text" ref="value" defaultValue={moment().format("MM/DD/YYYY")} onClick={this.openCalendar.bind(this)} onFocus={(e) => e.target.blur()} />
        {
          this.state.open ? (
            this.calendar()
          ) : (
            <div></div>
          )
        }
      </div>
    )
  }
}
