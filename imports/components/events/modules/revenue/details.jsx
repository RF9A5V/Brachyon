import React, { Component } from "react";
import moment from "moment";

import DateInput from "/imports/components/events/create/date_input.jsx";

export default class RevenueDetailsPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onDetailsSave() {
    Meteor.call("events.revenue.saveDetails", this.state.id, parseInt(this.refs.amount.value), moment(this.refs.date.value()).toDate(), (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated event revenue details.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div className="col">
        <div className="row flex-pad x-center">
          <span>Revenue Details</span>
          <button onClick={this.onDetailsSave.bind(this)}>Save</button>
        </div>
        <span>Crowdfunding Request</span>
        <input ref="amount" type="number" defaultValue={event.revenue.amount} />
        <span>Crowdfunding Due Date</span>
        <DateInput init={event.revenue.dueDate} ref="date" />
      </div>
    )
  }
}
