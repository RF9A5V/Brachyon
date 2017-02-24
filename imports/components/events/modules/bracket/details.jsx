import React, { Component } from "react";

export default class BracketInformation extends Component {
  render() {
    return (
      <div>
        <h4 style={{marginTop: 0}}>Bracket Details</h4>
        <div className="submodule-bg col">
          <p>
            Choose from Single Elimination, Double Elimination, Round Robin and Swiss. After you publish your event, a bracket page will be generated where participants can be added manually and/or users can request to join (in which case you will receive notification.
          </p>
          <div className="row center">
            <button onClick={() => {
              Meteor.call("events.addModule.brackets", Events.findOne()._id, (err) => {
                if(err) {
                  return toastr.error(err.reason);
                }
                else {
                  if(this.props.update) {
                    this.props.update();
                  }
                  return toastr.warn("Remember to add a bracket!");
                }
              })
            }}>
              Add Module
            </button>
          </div>
        </div>
      </div>
    )
  }
}
