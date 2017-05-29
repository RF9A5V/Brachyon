import React, { Component } from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DateInput extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var initTime = moment();
    if(props.init) {
      initTime = moment(props.init);
    }
    if(props.startsAt) {
      var temp = moment(props.startsAt);
      if(initTime.isBefore(temp)){
        initTime = temp.add(1, "day");
        if(props.onChange){
          var obj = {
            month: initTime.month(),
            year: initTime.year(),
            date: initTime.date()
          }
          props.onChange(obj);
        }
      }
    }
    this.state = {
      open: false,
      time: initTime,
      month: initTime.month(),
      year: initTime.year()
    }
  }

  componentWillReceiveProps(next) {
    var initTime = moment();
    if(next.init) {
      initTime = moment(next.init);
    }
    if(next.startsAt) {
      var temp = moment(next.startsAt);
      if(initTime.isBefore(temp)){
        initTime = temp.add(1, "day");
        if(next.onChange){
          var obj = {
            month: initTime.month(),
            year: initTime.year(),
            date: initTime.date()
          }
          next.onChange(obj);
        }
      }
    }
    this.setState({
      time: initTime,
      month: initTime.month(),
      year: initTime.year()
    })
  }

  value() {
    return {
      month: this.state.month,
      year: this.state.year,
      date: this.state.time.date()
    }
  }

  days(opts) {
    self = this;
    var cursor = moment().year(this.state.year).month(this.state.month);
    var vals = Array.apply(null, { length: cursor.endOf("month").date() }).map(Number.call, Number);
    var empty = Array.apply(null, { length: cursor.startOf("month").day() }).map(Number.call, Number);
    return (
      <div className="calendar-days" style={{width: opts.calendarWidth}}>
        {
          empty.map(function() {
            return (
              <div className="calendar-days-entry" style={{width: opts.dayWidth, height: opts.dayWidth}}></div>
            )
          })
        }
        {
          vals.map((value) => {

            var isSelected = this.state.time.year() == this.state.year && this.state.time.month() == this.state.month && this.state.time.date() == value + 1;
            var targetTime = moment().year(this.state.year).month(this.state.month).date(value + 1).endOf("day");
            var pass = targetTime.isAfter(moment())
            if(this.props.startsAt) {
              pass = targetTime.isAfter(moment(this.props.startsAt).add(1, "day"));
            }
            return (
              <div className={`calendar-days-entry ${pass ? "active" : ""} ${isSelected ? "selected" : ""}`} onClick={pass ? self.setValue.bind(self) : () => {}} style={{fontSize: opts.fontSize, width: opts.dayWidth, height: opts.dayWidth}}>
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
    this.state.time = moment().year(this.state.year).month(this.state.month).date(e.target.innerHTML);
    if(this.props.onChange){
      var obj = {
        month: this.state.time.month(),
        year: this.state.time.year(),
        date: this.state.time.date()
      }
      this.props.onChange(obj);
    }
    this.forceUpdate();
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

  calendar(opts) {
    self = this;
    var cursor = moment().year(this.state.year).month(this.state.month);
    return (
      <div className='calendar' style={{width: opts.calendarWidth}}>
        <div className="calendar-month">
          <div ref="prevMonth" className="calendar-month-control" onClick={this.prevMonth.bind(this)}>
            <FontAwesome name="chevron-left" style={{fontSize: opts.headerSize}} />
          </div>
          <span style={{textAlign: 'center', fontSize: opts.headerSize}}>
            { cursor.format("MMMM YYYY") }
          </span>
          <div className="calendar-month-control" onClick={this.advanceMonth.bind(this)}>
            <FontAwesome name="chevron-right" style={{fontSize: opts.headerSize}} />
          </div>
        </div>
        <div className="calendar-days" style={{width: opts.calendarWidth}}>
          {
            ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"].map(function(val){
              return (
                <div className="calendar-days-entry" style={{fontSize: opts.fontSize, width: opts.dayWidth, height: opts.dayWidth}}>
                  { val }
                </div>
              );
            })
          }
        </div>
        {
          this.days(opts)
        }

      </div>
    )
  }

  renderBase(opts) {
    return (
      <div className="calendar-container">
        { this.calendar(opts) }
      </div>
    )
  }

  renderMobile(opts) {
    return this.renderDesktop();
    const dayWidth = 96;
    return this.renderBase({
      fontSize: "2.5em",
      dayWidth,
      calendarWidth: dayWidth * 7 + 20,
      headerSize: "3em"
    })
  }

  renderDesktop(opts) {
    const dayWidth = 32;
    return this.renderBase({
      fontSize: "1em",
      dayWidth,
      calendarWidth: dayWidth * 7 + 20,
      headerSize: "1em"
    })
  }

}
