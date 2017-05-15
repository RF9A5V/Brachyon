import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { connectFB, connectTwitter, connectTwitch, connectInsta } from "/imports/decorators/social_media.js";

export default class OauthOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
  }

  registerService() {
    const callMap = {
      "facebook": connectFB,
      "twitter": connectTwitter,
      "twitch": connectTwitch,
      "instagram": connectInsta
    };
    callMap[this.props.type](this.forceUpdate.bind(this))
  }

  unlinkService() {
    const callMap = {
      "facebook": "user.unlinkFB",
      "twitter": "user.unlinkTwitter",
      "twitch": "user.unlinkTwitch",
      "instagram": "user.unlinkInsta"
    }
    Meteor.call(callMap[this.props.type], (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Unlinked service");
        this.forceUpdate();
      }
    })
  }

  render() {
    const service = Meteor.user().services[this.props.type];
    return (
      <div className="row col-1" style={{cursor: "pointer"}} onMouseEnter={() => {
        this.setState({
          hover: true
        })
      }} onMouseLeave={() => {
        this.setState({
          hover: false
        })
      }} onClick={service ? this.unlinkService.bind(this) : this.registerService.bind(this)}>
        <div className="row center x-center" style={{width: 50, height: 50, backgroundColor: service || this.state.hover ? this.props.color : "#111"}}>
          <FontAwesome name={this.props.type} size="2x" />
        </div>
        <div className="row center x-center col-1" style={{backgroundColor: "#666"}}>
          {
            service ? (
              `Connected to ${ this.props.type[0].toUpperCase() + this.props.type.slice(1) }`
            ) : (
              `Connect to ${ this.props.type[0].toUpperCase() + this.props.type.slice(1) }`
            )
          }

        </div>
      </div>
    )
  }
}
