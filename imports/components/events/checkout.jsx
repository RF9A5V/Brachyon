import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TicketCheckout from "./checkout/ticket.jsx";
import TierCheckout from "./checkout/tier.jsx";
import PaymentCheckout from "./checkout/payment.jsx";
import CheckoutConfirmation from "./checkout/confirmation.jsx";
import Loading from "/imports/components/public/loading.jsx";

import { Images } from "/imports/api/event/images.js";

export default class CheckoutPage extends TrackerReact(Component) {

  constructor(props){
    super(props);
    this.state = {
      event: Meteor.subscribe("event", props.params.eventId),
      index: 0
    }
  }

  bannerOrDefault() {
    var event = Events.findOne();
    var img = Images.findOne(event.details.banner);
    if(img) {
      return img.link();
    }
    return "/images/bg.jpg";
  }

  items() {
    var event = Events.findOne();
    var items = [];
    if(event.tickets) {
      items.push(
        <TicketCheckout ref="0"/>
      );
    }
    if(event.crowdfunding.tiers && event.crowdfunding.tiers.length > 0) {
      items.push(
        <TierCheckout ref="1" />
      )
    }
    var price = this.calculatePrice();
    if(price > 0) {
      var comps = {
        ticketList: this.state.tickets,
        tierIndex: this.state.tierIndex
      }
      items.push(<PaymentCheckout ref="2" price={price} {...comps} />);
    }
    items.push(<CheckoutConfirmation ref="3" />)
    return items;
  }

  calculatePrice() {
    var total = 0;
    var event = Events.findOne();
    if(this.state.tickets) {
      this.state.tickets.forEach((key) => {
        var ticket = event.tickets[key];
        total += ticket.price;
      });
    }
    if(this.state.tierIndex != null && this.state.tierIndex >= 0) {
      var tier = event.crowdfunding.tiers[this.state.tierIndex];
      total += tier.price;
    }
    return total;
  }

  advanceState() {
    var comp = this.refs[this.state.index];
    if(comp.isValid()) {
      var values = comp.value();
      this.state.index += 1;
      this.setState(values);
    }
    else {
      toastr.error("Invalid input.", "Error!");
    }
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <Loading />
      );
    }
    var items = this.items();
    return (
      <div className="box" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.bannerOrDefault()})`, backgroundSize: "cover", backgroundPosition: "50% 50%"}}>
        {
          items.map((comp, i) => {
            return (
              <div style={{display: this.state.index == i ? "block" : "none"}}>
                { comp }
              </div>
            )
          })
        }
        <div className="row center">
          {
            this.state.index > 0 ? (
              <button style={{marginRight: 10}} onClick={() => { this.setState({ index: this.state.index - 1 }) }}>Back</button>
            ) : (
              ""
            )
          }
          {
            this.state.index == items.length - 1 ? (
              <button onClick={() => { toastr.warning("Not yet implemented", "Woah!") }}>Submit</button>
            ) : (
              <button onClick={() => { this.advanceState() }}>Next</button>
            )
          }
        </div>
      </div>
    )
  }
}
