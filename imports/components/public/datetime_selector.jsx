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
    return time.startOf("minute").toDate();
  }

  render() {
    return (
      <div className="row x-center" style={{padding: 20, backgroundColor: "#111", margin: 10}}>
        <div className="row center col-1">
          <DateInput init={this.state.currentTime} ref="date" startsAt={this.props.startsAt} />
        </div>
        <div className="row center col-1">
          <TimeInput init={this.state.currentTime} ref="time" />
        </div>
      </div>
    )
  }
}
