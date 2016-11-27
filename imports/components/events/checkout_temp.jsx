import React, { Component } from "react";

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
        tickets: props.location.query["use"] == "tickets" ? props.location.query["selected"] : [],
        tier: props.location.query["use"] == "tier" ? props.location.query["selected"] : -1
      }
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  imgOrDefault() {
    var event = Events.findOne();
    if(event.details.banner){
      return Images.findOne(event.details.banner).link();
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
          <CheckoutSelector init={this.state.selector} startWith={this.props.location.query.use} changeCart={(obj) => {
            this.setState({
              selector: obj
            })
          }} />
        </div>
      </div>
    )
  }
}
