import React, { Component } from "react";

import DateInput from "./date_input.jsx";

export default class RevenuePanel extends Component {

  componentWillMount() {
    this.setState({
      active: false
    })
  }

  onChange(e) {
    this.props.onChange(this.state.active, !isNaN(this.refs.amount.value * 1) && this.refs.amount.value.length > 0);
    this.forceUpdate();
  }

  value() {
    return {
      active: this.state.active,
      amount: this.refs.amount.value * 1,
      dueDate: this.refs.dueDate.value()
    }
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <i style={{lineHeight: 1.5}}>Using crowdfunding will require your event to undergo a review process before people can see it on our site.</i>
        </div>
        <div className="row x-center">
          <label>Using Crowdfunding or Ticketing?</label>
          <input type="checkbox" checked={this.state.active} onChange={() => { this.state.active = !this.state.active; this.onChange(); }}/>
        </div>
        <div style={{
          display: this.state.active ? "inherit" : "none"
        }}>
          <div className="col" style={{marginTop: 20}}>
            <label>Amount</label>
            <input type="text" ref="amount" placeholder="Amount" onChange={ this.onChange.bind(this) } />
          </div>
          <div className="col">
            <label>Due Date</label>
            <div>
              <DateInput ref="dueDate" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
