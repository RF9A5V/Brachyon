import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import PaymentModal from "/imports/components/public/payment.jsx";

import CFTree from "./tree.jsx";

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
                      <b style={{marginLeft: 20}}>${ (tier.price / 100).toFixed(2) }</b>
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
        <Modal className="create-modal" overlayClassName="cred-overlay" isOpen={this.state.helpOpen}>
          <div className="row justify-end">
            <FontAwesome onClick={() => { this.setState({helpOpen: false}) }} name="times" size="2x" className="close-modal"/>
          </div>
          <div>
            <b>So what the hell is this?</b>
            <div style={{marginTop: 20}}>
              Don’t fucking lie to yourself. Someday is not a fucking day of the week. To go partway is easy, but mastering anything requires hard fucking work. Never, never assume that what you have achieved is fucking good enough. Use your fucking hands. This design is fucking brilliant. You won’t get good at anything by doing it a lot fucking aimlessly.
            </div>
            <div style={{marginTop: 20}}>
              Nothing of value comes to you without fucking working at it. Remember it’s called the creative process, it’s not the creative fucking moment. Don’t fucking lie to yourself. You need to sit down and sketch more fucking ideas because stalking your ex on facebook isn’t going to get you anywhere.
            </div>
            <div style={{marginTop: 20}}>
              Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. This design is fucking brilliant. You won’t get good at anything by doing it a lot fucking aimlessly. Don’t worry about what other people fucking think. When you design, you have to draw on your own fucking life experiences. If it’s not something you would want to read/look at/use then why fucking bother? Must-do is a good fucking master. This design is fucking brilliant. The details are not the details. They make the fucking design.
            </div>
          </div>
        </Modal>
        <PaymentModal open={this.state.open} price={this.state.price} owner={this.props.owner} type="tier"/>
      </div>
    );
  }
}
