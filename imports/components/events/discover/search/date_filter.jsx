import React, { Component } from "react";

import DateInput from "../../create/date_input.jsx";
import TimeInput from "../../create/time_input.jsx";

export default class DateFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      useTime: false
    };
  }

  onDateChange() {
    var date = this.refs.date.value();
    console.log(date);
    this.props.onChange({
      date
    });
  }

  render() {
    return (
      <div className="row" style={{alignItems: "flex-end"}}>
        <div className="col" style={{marginRight: 10}}>
          <label>Date</label>
          <div className="row">
            <div style={{marginRight: 10}}>
              <DateInput ref="date" onChange={this.onDateChange.bind(this)} />
            </div>
          </div>
        </div>
        {
          this.state.useTime ? (
            <div className="col" style={{marginRight: 10}}>
              <label>Time</label>
              <div>
                <TimeInput ref="time" />
              </div>
            </div>
          ) : (
            ""
          )
        }
        <button onClick={() => {this.setState({ useTime: !this.state.useTime })}} style={{marginBottom: 2.5}}>
          {
            this.state.useTime ? (
              "Remove Time"
            ) : (
              "Use Time"
            )
          }
        </button>
      </div>
    )
  }
}
