import React, { Component } from "react";
import { browserHistory } from "react-router";

import Leagues from "/imports/api/leagues/league.js";

export default class SubmitPanel extends Component {

  constructor(props) {
    super(props);
    var league = Leagues.findOne();
    Meteor.call("leagues.edit", league.slug, props.changelog, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully edited league!", "Success!");

        this.setState({
          success: true
        })
      }
    });
    this.state = {
      success: false
    }
  }

  render() {
    return (
      <div>
        {
          this.state.success ? (
            "Updated League"
          ) : (
            "Loading..."
          )
        }
      </div>
    )
  }
}
