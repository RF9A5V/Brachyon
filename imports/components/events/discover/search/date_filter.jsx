import React, { Component } from "react";

export default class DateFilter extends Component {
  render() {
    return (
      <div className="col">
        <label>Date and Time</label>
        <div className="row">
          <input type="date" style={{margin: 0, height: 40, marginRight: 10, boxSizing: "border-box" }} />
          <input type="time" style={{margin: 0, height: 40, boxSizing: "border-box" }} />
        </div>
      </div>
    )
  }
}
