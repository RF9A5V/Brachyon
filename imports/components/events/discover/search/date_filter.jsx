import React, { Component } from "react";

import DateInput from "../../create/date_input.jsx";
import TimeInput from "../../create/time_input.jsx";

export default class DateFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      useTime: false,
      useRange: false,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null
    };
  }

  parentChangeWrapper(){
    this.props.onChange({
      startDate: {
        date: this.state.startDate,
        time: this.state.startTime
      },
      endDate: {
        date: this.state.endDate,
        time: this.state.endTime
      }
    });
  }

  onStartDateChange() {
    this.state.startDate = this.refs.date.value();
    this.parentChangeWrapper();
  }

  onStartTimeChange() {
    this.state.startTime = this.refs.time.value();
    this.parentChangeWrapper();
  }

  onEndDateChange() {
    this.state.endDate = this.refs.endDate.value();
    this.parentChangeWrapper();
  }

  onEndTimeChange() {
    this.state.endTime = this.refs.endTime.value();
    this.parentChangeWrapper();
  }

  render() {
    return (
      <div className="row" style={{alignItems: "flex-end"}}>
        <div className="col" style={{marginRight: 10}}>
          <label>Date</label>
          <div className="row">
            <div>
              <DateInput ref="date" onChange={this.onStartDateChange.bind(this)} />
            </div>
          </div>
        </div>
        {
          this.state.useTime ? (
            <div className="col" style={{marginRight: 10}}>
              <label>Time</label>
              <div>
                <TimeInput ref="time" onChange={this.onStartTimeChange.bind(this)} />
              </div>
            </div>
          ) : (
            ""
          )
        }
        {
          this.state.useRange ? (
            <div className="row">
              <div className="col" style={{marginRight: 10}}>
                <label>End Date</label>
                <div>
                  <DateInput ref="endDate" onChange={this.onEndDateChange.bind(this)} />
                </div>
              </div>
              <div className="col" style={{marginRight: 10}}>
                <label>End Time</label>
                <div>
                  <TimeInput ref="endTime" onChange={this.onEndTimeChange.bind(this)} />
                </div>
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
        <button onClick={() => {
          this.state.useRange = !this.state.useRange;
          if(!this.state.useRange) {
            this.state.endDate = null;
            this.state.endTime = null;
          }
          this.forceUpdate();
        }}  style={{marginBottom: 2.5, marginLeft: 10}}>
          {
            this.state.useRange ? (
              "Remove Date Range"
            ) : (
              "Set Date Range"
            )
          }
        </button>
      </div>
    )
  }
}
