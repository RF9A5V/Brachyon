import React, { Component } from "react";
import moment from "moment";

import DateSelect from "/imports/components/events/create/date_input.jsx";
import TimeSelect from "/imports/components/events/create/time_input.jsx";

export default class DatetimePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  value() {
    var current = moment();
    var date = this.refs.date.value();
    var time = this.refs.time.value();
    Object.keys(date).forEach(k => {
      current.set(k, date[k]);
    });
    Object.keys(time).forEach(k => {
      current.set(k, time[k]);
    })
    return current.toDate();
  }

  render() {
    var event = Events.findOne();
    return (
      <div className="row">
        <div className="submodule-section">
          <DateSelect ref="date" init={event.details.datetime} />
          <TimeSelect ref="time" init={event.details.datetime} style={{marginTop: 20}} />
        </div>
        <div className="submodule-section col-1 row center x-center">
          <span className="section">This event will start on <span style={{color: "#00BDFF"}}>{moment(event.details.datetime).format("MMMM Do, YYYY")}</span> @ <span style={{color: "#00BDFF"}}>{moment(event.details.datetime).format("h:mmA")}</span>.</span>
        </div>
      </div>
    )
  }
}
