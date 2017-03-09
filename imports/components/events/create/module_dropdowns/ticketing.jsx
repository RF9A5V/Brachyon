import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TicketingPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentType: "onsite",
      discounts: {},
      free: {}
    }
  }

  value() {
    var obj = {};
    obj["venue"] = parseInt(parseFloat(this.refs.venue.value) * 100);
    this.props.brackets.forEach((b, i) => {
      if(this.state.free[i]) {
        obj[i] = {
          price: 0
        }
      }
      else {
        obj[i] = {
          price: parseInt(parseFloat(this.refs[i].value) * 100),
          discounts: (this.state.discounts[i] || []).map(j => {
            return {
              name: this.refs[i + "_discountName_" + j].value,
              price: parseInt(parseFloat(this.refs[i + "_discountPrice_" + j].value) * 100)
            }
          })
        }
      }
    });
    return obj;
  }

  render() {
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
                <div className="col" style={{marginBottom: 10, padding: 10, border: "solid 2px #666"}} key={id}>
                  <div className="row x-center" style={{marginBottom: 10}}>
                    <div className="col-1">
                      Bracket {i + 1}
                    </div>
                    <div className="row col-1 x-center">
                      {
                        this.state.free[id] ? (
                          <div style={{margin: "0 10px"}}>Free</div>
                        ) : (
                          <div>
                            $<input ref={id} type="number" style={{margin: "0 10px"}} defaultValue={0} />
                          </div>
                        )
                      }
                      <div className="row x-center">
                        <input type="checkbox" style={{margin: 0, marginRight: 10}} checked={this.state.free[id] == true} onClick={() => {
                          if(this.state.free[id]) {
                            delete this.state.free[id];
                          }
                          else {
                            this.state.free[id] = true;
                            delete this.state.discounts[id];
                          }
                          this.forceUpdate();
                        }} />
                        <span>
                          Is this bracket free?
                        </span>
                      </div>
                    </div>
                  </div>
                  {
                    this.state.free[id] ? (
                      null
                    ) : (
                      <hr className="user-divider" />
                    )
                  }
                  {
                    this.state.discounts[id] ? (
                      <div className="row center">
                        <label>Discounts</label>
                      </div>
                    ) : (
                      null
                    )
                  }
                  {
                    (this.state.discounts[id] || []).map((val, i) => {
                      return (
                        <div className="row x-center" style={{marginBottom: 10}} key={id + "_" + val}>
                          <div className="col-1">
                            <input type="text" ref={id + "_discountName_" + i} style={{margin: 0, marginRight: 10}} defaultValue={""} placeholder="Discount Name" />
                          </div>
                          <div className="row x-center col-1">
                            $<input type="number" ref={id + "_discountPrice_" + i} style={{margin: "0 10px"}} defaultValue={0} />
                            <FontAwesome size="2x" name="times" onClick={() => {
                              this.state.discounts[id].splice(i, 1);
                              this.forceUpdate();
                            }} />
                          </div>
                        </div>
                      )
                    })
                  }
                  {
                    this.state.free[id] ? (
                      null
                    ) : (
                      <div className="row center">
                        <button onClick={() => {
                          this.state.discounts[id] ? this.state.discounts[id].push(this.state.discounts[id][this.state.discounts[id].length - 1] + 1) : this.state.discounts[id] = [0];
                          this.forceUpdate();
                        }}>Add A Discount</button>
                      </div>
                    )
                  }
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
              <span>Cash Only</span>
            </div>
            <div className="row">
              <input name="type" type="radio" checked={this.state.paymentType == "both"} onClick={() => { this.setState({
                paymentType: "both"
              })}} />
              <span>Cash And Credit</span>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div className="text-description border-blue">
        Ticketing allows your event to track payments, accept debit/credit payment and offer/track discounts. In order to use this module you will need a stripe account. For more information on how refunds and other issues work see Brachyon's <a target="_blank" href="/faq">Tournament Organizer Faq</a>.    
      </div>
    )
  }
}
