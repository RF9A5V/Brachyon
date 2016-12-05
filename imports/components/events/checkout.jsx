import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TicketCheckout from "./checkout/ticket.jsx";
import TierCheckout from "./checkout/tier.jsx";
import PaymentCheckout from "./checkout/payment.jsx";
import CheckoutCompletion from "./checkout/completion.jsx";
import Loading from "/imports/components/public/loading.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class CheckoutPage extends TrackerReact(Component) {

  constructor(props){
    super(props);
    this.state = {
      event: Meteor.subscribe("event", props.params.eventId, {
        onReady: () => {
          var event = Events.findOne();
          var keys = [];
          if(event.tickets) {
            keys.push("tickets");
          }
          if(event.crowdfunding && event.crowdfunding.tiers && event.crowdfunding.tiers.length > 0) {
            keys.push("tiers");
          }
          keys.push("payment");
          keys.push("complete");
          this.setState({
            keys
          });
        }
      }),
      index: 0,
      dataStore: {}
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  bannerOrDefault() {
    var event = Events.findOne();
    var img = Banners.findOne(event.details.banner);
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
        <TicketCheckout ref="tickets"/>
      );
    }
    if(event.crowdfunding.tiers && event.crowdfunding.tiers.length > 0) {
      items.push(
        <TierCheckout ref="tiers" />
      )
    }
    var price = this.calculatePrice();
    if(price > 0) {
      var comps = {
        ticketList: this.state.dataStore.tickets,
        tierIndex: this.state.dataStore.tierIndex
      }
      items.push(<PaymentCheckout ref="payment" price={price} {...comps} />);
    }
    items.push(<CheckoutCompletion ref="complete" id={this.props.params.eventId} />)
    return items;
  }

  calculatePrice() {
    var total = 0;
    var event = Events.findOne();
    if(this.state.dataStore.tickets) {
      this.state.dataStore.tickets.forEach((key) => {
        var ticket = event.tickets[key];
        total += ticket.price;
      });
    }
    if(this.state.dataStore.tierIndex != null && this.state.dataStore.tierIndex >= 0) {
      var tier = event.crowdfunding.tiers[this.state.dataStore.tierIndex];
      total += tier.price;
    }
    return total;
  }

  advanceState() {
    console.log(this.state.keys[this.state.index]);
    var comp = this.refs[this.state.keys[this.state.index]];
    if(comp.isValid()) {
      comp.value((obj) => {
        for(var i in obj) {
          this.state.dataStore[i] = obj[i];
        }
        if(this.state.keys[this.state.index] == "payment") {
          Meteor.call("events.checkout", this.props.params.eventId, this.state.dataStore, (e) => {
            if(e) {
              toastr.error(e.reason, "Error!");
            }
            else {
              this.state.index += 1;
              toastr.success("Successfully processed payment!", "Success!");
              this.forceUpdate();
            }
          })
        }
        else {
          this.state.index += 1;
        }
      });
      this.forceUpdate();
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
            this.state.index > 0 && this.state.index < items.length - 1 ? (
              <button style={{marginRight: 10}} onClick={() => { this.setState({ index: this.state.index - 1 }) }}>Back</button>
            ) : (
              ""
            )
          }
          {
            this.state.index < items.length - 1 ? (
              [
                <button onClick={() => { this.advanceState() }}>Next</button>
              ]
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }
}
