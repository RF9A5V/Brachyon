import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TicketingPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentType: "cash",
      fees: {
        venue: {
          price: (0).toFixed(2)
        }
      },
      discounts: {},
      discountCount: 0,
      active: 0
    }
  }

  componentWillReceiveProps(next) {
    var obj = {
      venue: this.state.fees.venue
    };
    next.brackets.forEach(k => {
      obj[k] = this.state.fees[k] || { price: (0).toFixed(2) };
    });
    this.state.fees = obj;
  }

  value() {

    var feeObj = {};
    Object.keys(this.state.fees).forEach(k => {
      feeObj[k] = {
        price: parseInt(parseFloat(this.state.fees[k].price) * 100),
        description: this.state.fees[k].description
      };
    })
    var obj = {
      fees: feeObj,
      discounts: Object.keys(this.state.discounts).map(k => {
        if(this.state.discounts[k].name == "") {
          toastr.error("Your discount needs a name!");
          throw new Error("Discounts must be named.");
        }
        if(this.state.discounts[k].price == 0) {
          toastr.error("Discounts can't be zero!");
          throw new Error("Can't have a free discount!");
        }
        return this.state.discounts[k];
      })
    };
    obj.paymentType = this.state.paymentType;
    return obj;
  }

  feePanel() {
    return Object.keys(this.state.fees).sort((a, b) => {
      if(isNaN(a)) {
        if(isNaN(b)) {
          return 0;
        }
        return -1;
      }
      else if(isNaN(b)) {
        return 1;
      }
      const diff = parseInt(a) - parseInt(b);
      return diff / Math.abs(diff);
    }).map(key => {
      return (
        <div className="row" style={{marginBottom: 10}} key={key}>
          <div className="col-1">
            <span>{ isNaN(key) ? key[0].toUpperCase() + key.slice(1) : "Entry to Bracket " + (parseInt(key) + 1) }</span>
          </div>
          <div className="col col-2">
            <div className="row x-center">
              $
              <input type="number" style={{margin: 0, marginLeft: 10, marginRight: 10}} value={this.state.fees[key].price} onChange={(e) => {
                this.state.fees[key].price = parseFloat(e.target.value);
                this.forceUpdate();
              }} onBlur={(e) => {
                this.state.fees[key].price = parseFloat(e.target.value).toFixed(2);
                this.forceUpdate();
              }} />
              <div className="row x-center">
                <input type="checkbox" checked={this.state.fees[key].price == 0} onClick={() => {
                  this.state.fees[key].price = (0).toFixed(2);
                  this.forceUpdate();
                }} style={{margin: 0, marginRight: 10}} />
                <span>Is this fee free?</span>
              </div>
            </div>
            <textarea style={{marginLeft: 18}} placeholder="Description (Optional)" onChange={(e) => {
              this.state.fees[key].description = e.target.value;
            }} value={this.state.fees[key].description}></textarea>
          </div>
        </div>
      )
    })
  }

  discountPanel() {
    return (
      <div>
        {
          Object.keys(this.state.discounts).map(key => {
            var d = this.state.discounts[key];
            return (
              <div className="row" style={{marginBottom: 10, justifyContent: "flex-start"}} key={key}>
                <div className="col col-1">
                  <div className="row x-center">
                    <input type="text" style={{margin: 0}} defaultValue={d.name} onChange={(e) => {
                      d.name = e.target.value
                    }} />
                    <FontAwesome name="times" size="2x" style={{marginLeft: 10}} onClick={() => {
                      delete this.state.discounts[key];
                      this.forceUpdate();
                    }} />
                  </div>
                </div>
                <div className="col col-2">
                  <div className="row x-center">
                    $
                    <input type="number" style={{margin: 0, marginLeft: 10}} defaultValue={(d.price / 100).toFixed(2)} onChange={(e) => {
                      d.price = parseInt(parseFloat(e.target.value) * 100)
                    }} onBlur={(e) => {
                      e.target.value = parseFloat(e.target.value).toFixed(2)
                    }} />
                  </div>
                  <textarea style={{marginLeft: 18}} placeholder="Description (Optional)" onChange={(e) => {
                    d.description = e.target.value;
                  }} value={d.description}></textarea>
                </div>
              </div>
            )
          })
        }
        <button onClick={() => {
          this.state.discounts[this.state.discountCount++] = {
            name: "",
            price: 0
          };
          this.forceUpdate()
        }}>Add Discount</button>
      </div>
    );
  }

  currentPanel() {
    switch(this.state.active) {
      case 0:
        return this.feePanel()
      case 1:
        return this.discountPanel()
    }
  }

  render() {
    if(this.props.status) {
      return (
        <div className="col">
          <div className="row" style={{marginBottom: 20}}>
            {
              ["Fees", "Discounts"].map((a, b) => {
                return (
                  <div style={{borderBottom: this.state.active == b ? "solid 2px #FF6000" : "none", padding: 5, cursor: "pointer"}} onClick={() => { this.setState({
                    active: b
                  }) }}>
                    { a }
                  </div>
                )
              })
            }
          </div>
          {
            this.currentPanel()
          }
          <span>Payment Options</span>
          <form ref="paymentOption">
            <div className="row">
              <input type="radio" name="type" checked={this.state.paymentType == "cash"} onClick={() => { this.setState({
                paymentType: "cash"
              })}} />
              <span style={{marginLeft: 5}}>Cash Only</span>
            </div>
            <div className="row">
              <input type="radio" name="type" checked={this.state.paymentType == "credit"} onClick={() => { this.setState({
                paymentType: "credit"
              })}} />
              <span style={{marginLeft: 5}}>Credit Only</span>
            </div>
            <div className="row">
              <input name="type" type="radio" checked={this.state.paymentType == "both"} onClick={() => { this.setState({
                paymentType: "both"
              })}} />
              <span style={{marginLeft: 5}}>Cash And Credit</span>
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
