import React, { Component } from 'react';

import CurrencyInput from "/imports/components/public/currency_input.jsx";

export default class PromotionPanel extends Component {

  submitBid(e) {
    e.preventDefault();
    Meteor.call("events.updatePromotionBid", Events.findOne()._id, this.refs.bid.value(), function(err) {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated event bid!", "Success!");
      }
    })
  }

  render() {
    var promotion = Events.findOne().promotion;
    return (
      <div className="col x-center">
        <div className="side-tab-panel col">
          <div className="row x-center flex-pad">
            <h3>Front Page Access</h3>
            <button onClick={this.submitBid.bind(this)}>Save</button>
          </div>
          <CurrencyInput ref="bid" amount={promotion.bid} />
        </div>
      </div>
    )
  }
}
