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
        this.props.onItemSelect(this.props.activeItem, 0);
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
        <div className="submodule-bg">
          <div className="col x-center">
            <h3 style={{marginBottom: 20}}>Date and Time</h3>
            <DateSelect ref="date" init={event.details.datetime} />
            <TimeSelect ref="time" init={event.details.datetime} />
          </div>
        </div>
      </div>
    )
  }
}
