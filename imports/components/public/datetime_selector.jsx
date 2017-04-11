import React, { Component } from "react";
import moment from "moment";

import DateInput from "../events/create/date_input.jsx";
import TimeInput from "../events/create/time_input.jsx";

export default class DatetimeSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTime: moment().add(1, "hour").startOf("hour")
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

  render() {
    return (
      <div className="col center x-center" style={{padding: 20}}>
        <div style={{marginBottom: 10, display: "inline-block"}}>
          <DateInput init={this.state.currentTime} ref="date" startsAt={this.props.startsAt} />
        </div>
        <div style={{display: "inline-block", clear: "left"}}>
          <TimeInput init={this.state.currentTime} ref="time" />
        </div>
      </div>
    )
  }
}
