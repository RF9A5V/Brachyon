import React, { Component } from "react";
import moment from "moment";

import DateInput from "../events/create/date_input.jsx";
import TimeInput from "../events/create/time_input.jsx";

export default class DatetimeSelector extends Component {

  constructor(props) {
    super(props);
    var date = moment().add(1, "hour").startOf("hour").toDate();
    if(props.init) {
      date = moment(props.init).toDate()
    }
    else {

    }
    this.state = {
      currentTime: date
    }
  }

  value() {
    var majorComp = this.refs.date.value();
    var minorComp = this.refs.time.value();
    var time = moment();
    Object.keys(majorComp).forEach(key => {
      time.set(key, majorComp[key]);
    });
    Object.keys(minorComp).forEach(key => {
      time.set(key, minorComp[key]);
    });
    var result = time.startOf("minute");
    if(result.isBefore(moment())) {
      toastr.error(`Start time provided is before now. No time travelling is allowed.`);
      throw new Error("Start time of " + moment().toDate() + " is after " + result.toDate());
    }
    return result.toDate();
  }

  setValue(obj) {
    var date = moment(this.state.currentTime);
    Object.keys(obj).forEach(k => {
      date.set(k, obj[k]);
    });
    this.setState({
      currentTime: date.toDate()
    })
  }

  render() {
    return (
      <div className="col center x-center" style={{padding: 20}}>
        <div style={{marginBottom: 10, display: "inline-block"}}>
          <DateInput init={this.state.currentTime} ref="date" onChange={this.setValue.bind(this)} />
        </div>
        <div style={{display: "inline-block", clear: "left"}}>
          <TimeInput init={this.state.currentTime} ref="time" onChange={this.setValue.bind(this)} />
        </div>
      </div>
    )
  }
}
