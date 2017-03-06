import React, { Component } from "react";

export default class TicketsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      discounts: {},
      max: 0,
      paymentOption: "onsite"
    }
  }

  value() {
    var discounts = [];
    Object.keys(this.state.discounts).forEach(k => {
      discounts.push({
        name: this.refs[`name${k}`].value,
        price: parseInt(parseFloat(this.refs[`price${k}`].value) * 100)
      })
    });
    console.log(discounts);
    return {
      venue: parseInt(parseFloat(this.refs.venuePrice.value) * 100),
      "0": {
        price: parseInt(parseFloat(this.refs.entryPrice.value) * 100),
        discounts
      },
      paymentType: this.state.paymentOption
    }
  }

  render() {
    if(!this.props.status) {
      return (
        <div>
          Description goes here!
        </div>
      )
    }
    return (
      <div>
        <div className="row x-center" style={{marginBottom: 10}}>
          <div className="col-1">
            Venue Fee
          </div>
          <div className="col-1 row x-center">
            $
            <input type="number" ref="venuePrice" style={{margin: 0, marginLeft: 10}} />
          </div>
        </div>
        <div className="row x-center" style={{marginBottom: 10}}>
          <div className="col-1">
            Event Entry Fee
          </div>
          <div className="col-1 row x-center">
            $
            <input type="number" ref="entryPrice" style={{margin: 0, marginLeft: 10}} />
          </div>
        </div>
        {
          Object.keys(this.state.discounts).length ? (
            [
              <hr className="user-divider" />,
              <h5 style={{textAlign: "center", marginBottom: 10}}>Discounts</h5>
            ]
          ) : (
            null
          )
        }
        {
          Object.keys(this.state.discounts).map(k => {
            return (
              <div className="row x-center" key={k} style={{marginBottom: 10}}>
                <div className="col-1">
                  <input ref={`name${k}`} type="text" style={{margin: 0}} />
                </div>
                <div className="col-1 row x-center">
                  $
                  <input ref={`price${k}`} type="number" style={{margin: 0, marginLeft: 10}} />
                </div>
              </div>
            )
          })
        }
        <button onClick={() => {
          this.state.discounts[this.state.max++] = true;
          this.forceUpdate();
        }}>Add Discount</button>
        <h5>Payment Options</h5>
        <div className="row x-center">
          <input style={{margin: 0}} type="radio" name="paymentOption" checked={this.state.paymentOption=="onsite"} onClick={() => {
            this.setState({ paymentOption: "onsite" })
          }} />
          <span style={{marginLeft: 10}}>On Site Payments Only</span>
        </div>
        <div className="row x-center">
          <input style={{margin: 0}} type="radio" name="paymentOption" checked={this.state.paymentOption=="both"} onClick={() => { this.setState({ paymentOption: "both" }) }} />
          <span style={{marginLeft: 10}}>On Site and Online</span>
        </div>
      </div>
    )
  }
}
