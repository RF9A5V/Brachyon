import React, { Component } from "react";
import { Session } from 'meteor/session'

import Loading from "/imports/components/public/loading.jsx";
import CheckoutSelector from "./checkout/selector.jsx";
import CheckoutMain from "./checkout/main.jsx";

export default class Checkout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          this.setState({
            ready0: true
          })
        }
      }),
      rewards: Meteor.subscribe("rewards", this.props.params.slug, {
        onReady: () => {
          this.setState({
            ready1: true
          })
        }
      }),
      ready0: false,
      ready1: false,
      selector: {
        tickets: Session.get("use") == "tickets" ? Session.get("tickets") : [],
        tier: Session.get("use") == "tiers" ? Session.get("tier") : -1,
        use: Session.get("use")
      }
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  imgOrDefault() {
    var event = Events.findOne();
    if(event.details.banner){
      return Banners.findOne(event.details.banner).link();
    }
    else {
      return "/images/bg.jpg";
    }
  }

  render() {
    if(!this.state.ready0 && !this.state.ready1) {
      return (
        <Loading />
      )
    }
    return (
      <div className="box col" style={{backgroundImage: `url(${this.imgOrDefault()})`, backgroundSize: "cover", backgroundPosition: "center center"}}>
        <div className="row col-1" style={{padding: 20}}>
          <CheckoutMain cart={this.state.selector} />
          <CheckoutSelector init={this.state.selector} changeCart={(obj) => {
            this.setState({
              selector: obj
            })
          }} />
        </div>
      </div>
    )
  }
}
