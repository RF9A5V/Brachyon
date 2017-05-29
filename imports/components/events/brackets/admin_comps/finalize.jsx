import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class FinalizeBracket extends ResponsiveComponent {

  closeBracketHandler() {
    var event = Events.findOne() || {};
    Meteor.call("events.brackets.close", event._id || Instances.findOne()._id, this.props.index || 0, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully closed bracket!", "Success!");
      }
    })
  }

  renderBase(opts) {
    const textStyle = {
      fontSize: opts.fontSize
    }
    return (
      <div>
        <p style={textStyle}>
          Closing the bracket will generate a leaderboard for the bracket and push statistics on performance to individual players. This action will also allow you to close your event successfully. This action cannot be taken while there are still matches to be played.
        </p>
        <div className="row center">
          <button className={"reset-highlight " + opts.buttonClass} onClick={this.closeBracketHandler.bind(this)}>Finalize</button>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      buttonClass: ""
    })
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "1em"
    })
  }
}
