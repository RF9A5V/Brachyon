import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import PaymentModal from "/imports/components/public/payment.jsx";
import CFTree from "./tree.jsx";
import PaymentSlider from "/imports/components/public/slider.jsx";

export default class CrowdfundingPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      open: false,
      helpOpen: false,
      price: 0
    }
  }

  openModal() {
    this.setState({
      open: true
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
  }

  sponsorshipCount() {
    var obj = {};
    var max = Infinity;
    Object.keys(this.props.tiers).reverse().map((value) => {
      var tierPrice = this.props.tiers[value].price;
      var count = 0;
      for(var key in this.props.contributors){
        if(this.props.contributors[key] >= tierPrice * 1 && this.props.contributors[key] < max){
          count++;
        }
      }
      obj[value] = count;
      max = tierPrice;
    })
    return obj;
  }

  render() {
    var self = this;
    return (
      <div className="row">
        <div className="col col-2 x-center">
          <h3>Tiers</h3>
          {
            this.props.tiers == null ? (
              ""
            ) : (
              Object.keys(this.props.tiers).map(function(key){
                var tier = self.props.tiers[key];
                return (
                  <div className="col tier-block" onClick={() => {self.setState({open: true, price: tier.price}); }}>
                    <div className="row x-center flex-pad" style={{marginBottom: 20}}>
                      <b style={{fontSize: 24}}>{ tier.name }</b>
                      <div className="row x-center">
                        <div style={{width: 25, height: 25, borderRadius: "100%", backgroundColor: "gold", marginRight: 10}}>
                        </div>
                        <b>{ tier.price }</b>
                      </div>

                    </div>
                    <span>{ tier.description }</span>
                    <div style={{textAlign: "right"}}>
                      <span style={{fontSize: 10}}>
                        Limit: <i>{ tier.limit }</i>
                      </span>
                    </div>
                  </div>
                )
              })
            )
          }
        </div>
        <div className="col-3 col x-center">
          <h3>Goals&nbsp;<sup onClick={(e) => { e.preventDefault();this.setState({helpOpen: true}) }}><a href="#">?</a></sup></h3>
          <CFTree goals={this.props.goals} />
        </div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="row">
            <h3 className="col-1">Sponsor this Event</h3>
            <FontAwesome name="times" onClick={() => { this.setState({open: false}) }} />
          </div>
          <PaymentSlider tiers={this.props.tiers} id={this.props.id} contrib={this.props.contributors[Meteor.userId()] || 0} goals={this.props.goals} count={this.sponsorshipCount()} close={() => { this.setState({open: false}) }} />
        </Modal>
      </div>
    );
  }
}
