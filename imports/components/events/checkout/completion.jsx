import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class CheckoutCompletion extends Component {
  render() {
    return (
      <div className="col">
        <div className="row center">
          <h3>Complete</h3>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-1 submodule-section col x-center">
            <h5>Success!</h5>
            <button onClick={() => { browserHistory.push("/events/" + this.props.slug + "/show") }}>Back To Event</button>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    )
  }
}
