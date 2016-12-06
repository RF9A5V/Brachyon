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

  onDatetimeSave() {
    var date = moment(this.refs.date.value() + "T" + this.refs.time.value()).toDate();
    Meteor.call("events.details.datetimeSave", this.state.id, date, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully updated datetime for event!", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div>
        <div className="button-row">
          <button onClick={this.onDatetimeSave.bind(this)}>Save</button>
        </div>
        <h4>Date and Time</h4>
        <div className="submodule-bg">
          <div className="row">
            <div className="submodule-section">
              <DateSelect ref="date" init={event.details.datetime} />
              <TimeSelect ref="time" init={event.details.datetime} />
            </div>
            <div className="submodule-section col-1 row center x-center">
              <span className="section">This event will start at {moment(event.details.datetime).format("MMMM Do, YYYY h:mmA")}.</span>
            </div>
          </div>
          <div style={{marginTop: 20}} className="row center"><button onClick={this.onDatetimeSave.bind(this)}>Save</button></div>
        </div>
      </div>
    )
  }
}
