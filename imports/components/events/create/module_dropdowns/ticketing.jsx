import React, { Component } from "react";

export default class TicketingPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentType: "onsite"
    }
  }

  value() {
    var obj = {};
    obj["venue"] = parseInt(parseFloat(this.refs.venue.value) * 100);
    this.props.brackets.forEach((b, i) => {
      obj[i] = parseInt(parseFloat(this.refs[b].value) * 100);
    });
    obj.paymentType = this.state.paymentType;
    return obj;
  }

  render() {
    console.log(this.props);
    if(this.props.status) {
      return (
        <div className="col">
          <div className="row x-center" style={{marginBottom: 10}}>
            <div className="col-1">
              Venue Fee
            </div>
            <div className="col-1">
              $<input ref="venue" type="number" style={{margin: 0, marginLeft: 10}} defaultValue={0} />
            </div>
          </div>
          {
            this.props.brackets.map((id, i) => {
              return (
                <div className="row x-center" style={{marginBottom: 10}} key={id}>
                  <div className="col-1">
                    Bracket {i + 1}
                  </div>
                  <div className="col-1">
                    $<input ref={id} type="number" style={{margin: 0, marginLeft: 10}} defaultValue={0} />
                  </div>
                </div>
              )
            })
          }
          <span>Payment Options</span>
          <form ref="paymentOption">
            <div className="row">
              <input type="radio" name="type" checked={this.state.paymentType == "onsite"} onClick={() => { this.setState({
                paymentType: "onsite"
              })}} />
              <span>On Site Only</span>
            </div>
            <div className="row">
              <input name="type" type="radio" checked={this.state.paymentType == "online"} onClick={() => { this.setState({
                paymentType: "online"
              })}} />
              <span>Online Only</span>
            </div>
            <div className="row">
              <input name="type" type="radio" checked={this.state.paymentType == "both"} onClick={() => { this.setState({
                paymentType: "both"
              })}} />
              <span>Both</span>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div>
        Ticket Descriptions go here!
      </div>
    )
  }
}
