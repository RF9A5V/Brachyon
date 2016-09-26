import React, { Component } from "react";
import moment from "moment";

import DateInput from "/imports/components/events/create/date_input.jsx";

export default class crowdfundingDetailsPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onDetailsSave() {
    Meteor.call("events.crowdfunding.saveDetails", this.state.id, parseInt(this.refs.amount.value), moment(this.refs.date.value()).toDate(), (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated event crowdfunding details.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div className="col">
        <div className="button-row">
          <button onClick={this.onDetailsSave.bind(this)}>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center">
            <h3>Details</h3>
          </div>
          <h5>Crowdfunding Request</h5>
          <input ref="amount" type="number" defaultValue={(event.crowdfunding || {}).amount} />
          <h5 style={{marginBottom: 20}}>Crowdfunding Due Date</h5>
          <div>
            <DateInput init={(event.crowdfunding || {}).dueDate} ref="date" />
          </div>
        </div>
      </div>
    )
  }
}
