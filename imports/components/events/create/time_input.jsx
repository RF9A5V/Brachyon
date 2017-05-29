import React, { Component } from 'react';
import moment from 'moment';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class TimeInput extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var obj = {
      hour: "12",
      minute: "00",
      half: "AM"
    }
    if(!this.state) {
      this.state = {};
    }
    if(props.init) {
      var current = moment(props.init);
      obj = {
        hour: parseInt(current.format("h")),
        minute: parseInt(current.format("mm")),
        half: current.format("A")
      }
    }
    Object.keys(obj).forEach(k => {
      this.state[k] = obj[k];
    })
  }

  componentWillReceiveProps(next) {
    if(next.init) {
      var current = moment(next.init);
      obj = {
        hour: parseInt(current.format("h")),
        minute: parseInt(current.format("mm")),
        half: current.format("A")
      }
      this.setState(obj);
      this.forceUpdate();
    }
  }

  onChange() {
    if(this.props.onChange){
      this.props.onChange(this.value());
    }
  }

  value() {
    var hour = parseInt(this.state.hour);
    if(hour == 12 && this.state.half == "AM") {
      hour = 0;
    }
    else if(hour < 12 && this.state.half == "PM") {
      hour += 12;
    }
    if(hour < 10) {
      hour = "0" + hour;
    }
    var minutes = parseInt(this.state.minute);
    if(minutes < 10) {
      minutes = "0" + minutes;
    }
    return {
      hour, minutes
    };
  }

  renderBase(opts) {
    var [hours, minutes] = [[], []];
    for(var i = 1; i <= 12; i ++){
      hours.push(i);
    }
    for(var i = 0; i < 60; i += 5){
      minutes.push(i);
    }
    return (
      <div style={this.props.style || { marginTop: opts.margin }}>
        <div className="time-input row center x-center">
          <select ref="hours" defaultValue={this.state.hour} onChange={(e) => {
            this.state.hour = e.target.value;
            this.onChange();
          }} style={{fontSize: opts.fontSize, marginRight: opts.margin, padding: opts.padding}}>
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
          <select ref="minutes" style={{marginRight: 10}} defaultValue={this.state.minute} onChange={(e) => {
            this.state.minute = e.target.value()
            this.onChange();
          }} style={{fontSize: opts.fontSize, marginRight: opts.margin, padding: opts.padding}}>
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
          <select ref="half" defaultValue={this.state.half} onChange={(e) => {
            this.state.half = e.target.value;
            this.onChange();
          }} style={{fontSize: opts.fontSize, padding: opts.padding}}>
            <option value={"AM"}>AM</option>
            <option value={"PM"}>PM</option>
          </select>
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      fontSize: "3em",
      margin: 30,
      padding: 20
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      margin: 10,
      padding: 10
    });
  }

}
