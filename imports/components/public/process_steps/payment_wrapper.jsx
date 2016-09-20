import React, { Component } from "react";
import LocationSelect from "/imports/components/events/create/location_select.jsx";

import CardPayment from "./card_payment.jsx";

export default class PaymentWrapper extends Component {

  value() {
    this.props.hack({
      name: this.refs.name.value,
      address: this.refs.address.value,
      city: this.refs.city.value,
      state: this.refs.state.value,
      zip: this.refs.zip.value,
      comment: this.refs.comment.value
    })
    this.refs[this.props.type].value();
  }

  paymentType() {
    if(this.props.type == "card") {
      return (
        <CardPayment ref={this.props.type} amount={this.props.amount} cb={this.props.cb}/>
      );
    }
    return (
      <div></div>
    );
  }

  render() {
    return (
      <div className="row">
        {
          // Yeah fuck it, style this later.
        }
        <div className="col-1" style={{marginRight: 20}}>
          {
            this.paymentType()
          }
        </div>
        <div className="col col-1">
          <div className="col-1">
            <div className="col">
              <span>
                Name
              </span>
              <input type="text" ref="name" />
            </div>
            <div className="col">
              <span>
                Address
              </span>
              <input type="text" ref="address" />
            </div>
            <div className="row">
              <div className="col">
                <span>
                  City
                </span>
                <input type="text" ref="city" />
              </div>
              <div className="col">
                <span>
                  State
                </span>
                <input type="text" ref="state" />
              </div>
              <div className="col">
                <span>
                  Zip
                </span>
                <input type="text" ref="zip" />
              </div>
            </div>
          </div>
          <div className="row col-1">
            <textarea placeholder="Add a comment (optional)" ref="comment"></textarea>
          </div>
        </div>
      </div>

    )
  }
}
