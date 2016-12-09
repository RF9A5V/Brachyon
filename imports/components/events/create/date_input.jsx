import React, { Component } from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

export default class DateInput extends Component {

  constructor(props) {
    super(props);
    var initTime = moment();
    if(props.init) {
      initTime = moment(props.init);
    }
    this.state = {
      open: false,
      time: initTime,
      month: initTime.month(),
      year: initTime.year()
    }
  }

  componentWillReceiveProps(next) {
    if(next.init) {
      var initTime = moment(next.init);
      this.setState({
        time: initTime,
        month: initTime.month(),
        year: initTime.year()
      })
    }
  }

  value() {
    return this.state.time.format("YYYYMMDD");
  }

  openCalendar() {
    this.setState({
      open: true
    })
  }

  closeCalendar() {
    this.setState({
      open: false
    })
  }

  days() {
    self = this;
    var cursor = moment().year(this.state.year).month(this.state.month);
    var vals = Array.apply(null, { length: cursor.endOf("month").date() }).map(Number.call, Number);
    var empty = Array.apply(null, { length: cursor.startOf("month").day() }).map(Number.call, Number);
    return (
      <div className="calendar-days">
        {
          empty.map(function() {
            return (
              <div className="calendar-days-entry"></div>
            )
          })
        }
        {
          vals.map((value) => {

            // var yearPass = this.state.year >= moment().year()
            // var dayPass = this.state.month > moment().month() || (this.state.month == moment().month() && value + 1 >= moment().date());
            //
            var isSelected = this.state.time.year() == this.state.year && this.state.time.month() == this.state.month && this.state.time.date() == value + 1;
            var targetTime = moment().year(this.state.year).month(this.state.month).date(value + 1).endOf("day");
            var pass = moment().isBefore(targetTime) || moment().isSame(targetTime);

            return (
              <div className={`calendar-days-entry ${pass ? "active" : ""} ${isSelected ? "selected" : ""}`} onClick={pass ? self.setValue.bind(self) : () => {}}>
                {value + 1}
              </div>
            )
          })
        }
      </div>
    );
  }

  setValue(e) {
    if(!e.target.classList.contains("active")){
      return;
    }
    // this.refs.value.value = moment().year(this.state.year).month(this.state.month).date(e.target.innerHTML).format("MM/DD/YYYY");
    this.state.time = moment().year(this.state.year).month(this.state.month).date(e.target.innerHTML);
    if(this.props.onChange){
      this.props.onChange();
    }
    this.forceUpdate();
    //this.closeCalendar();
  }

  prevMonth() {
    if(--this.state.month < 0){
      this.state.year--;
      this.state.month = 11;
    }
    this.forceUpdate();
  }

  advanceMonth() {
    if(++this.state.month > 11){
      this.state.month = 0;
      this.state.year++;
    }
    this.forceUpdate();
  }

  calendar() {
    self = this;
    var cursor = moment().year(this.state.year).month(this.state.month);
    return (
      <div className='calendar'>
        <div className="calendar-month">
          <div ref="prevMonth" className="calendar-month-control" onClick={this.prevMonth.bind(this)}>
            <FontAwesome name="chevron-left" />
          </div>
          <span style={{textAlign: 'center'}}>
            { cursor.format("MMMM YYYY") }
          </span>
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
          this.days()
        }

      </div>
    )
  }

  // <input type="text" ref="value" defaultValue={this.state.time.format("MM/DD/YYYY")} onClick={this.openCalendar.bind(this)} onFocus={(e) => e.target.blur()} style={{margin: 0}} />
  // {
  //   this.state.open ? (
  //     this.calendar()
  //   ) : (
  //     <div></div>
  //   )
  // }

  render() {
    return (
      <div className="calendar-container">
        { this.calendar() }
      </div>
    )
  }
}
