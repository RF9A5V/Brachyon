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
    Meteor.call("events.crowdfunding.saveDetails", this.state.id, parseInt(this.refs.amount.value) * 100, moment(this.refs.date.value()).toDate(), (err) => {
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
        <h4>Details</h4>
        <div className="submodule-bg">
          <div className="row">
            <div className="col" style={{padding: 20, backgroundColor: "#444", marginRight: 20}}>
              <h5>Crowdfunding Request</h5>
              <input ref="amount" type="number" defaultValue={event.crowdfunding.details.amount / 100} style={{marginRight: 0}} />
              <h5 style={{marginBottom: 20}}>Crowdfunding Due Date</h5>
              <div>
                <DateInput init={event.crowdfunding.details.dueDate} startsAt={moment(event.details.datetime).subtract(5, "days").toDate()} ref="date" />
              </div>
            </div>
            <div className="col-1 row center x-center" style={{padding: 20, backgroundColor: "#444"}}>
              <span style={{fontSize: "2em"}}>You are raising <span style={{color: "#00BDFF"}}>${(event.crowdfunding.details.amount / 100).toFixed(2)}</span> by <span style={{color: "#00BDFF"}}>{ moment(event.crowdfunding.details.dueDate).format("MMMM Do") }</span>.</span>
            </div>
          </div>
          <div className="row center" style={{marginTop: 20}}>
            <button onClick={this.onDetailsSave.bind(this)}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}
