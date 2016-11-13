import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import { browserHistory } from "react-router";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import BracketPage from "./preview/slides/brackets.jsx";
import CFPage from "./preview/slides/crowdfunding.jsx";
import StreamPage from "./preview/slides/stream.jsx";

import Instances from "/imports/api/event/instance.js";

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      users: Meteor.subscribe("event_participants", this.props.params.slug, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      sponsors: Meteor.subscribe("event_sponsors", this.props.params.slug, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      isReady: false,
      anim: false
    })
  }

  componentWillUnmount(){
    this.state.event.stop();
    this.state.users.stop();
    this.state.sponsors.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  slides() {
    var event = this.event();
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var pages = [
      {
        name: "Home",
        component: TitlePage
      }
    ];
    if(instance.brackets) {
      pages.push({
        name: "Brackets",
        component: BracketPage
      })
    }
    if(event.crowdfunding) {
      pages.push({
        name: "Crowdfunding",
        component: CFPage
      });
    }
    if(event.twitchStream){
      pages.push({
        name: "Streams",
        component: StreamPage
      })
    }
    return pages;
  }

  imgOrDefault() {
    var event = this.event();
    if(event.details.imageUrl) {
      return this.state.event.details.imageUrl;
    }
    return "/images/bg.jpg";
  }

  render() {
    if(!this.state.isReady){
      return (
        <div>Loading...</div>
      )
    }
    var event = this.event();
    return (
      <div className="box col" style={{flexFlow: "row", position: "relative"}}>
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={event.details.name + " @ Brachyon"} />
        <meta property="og:image" content={this.imgOrDefault()} />
        <meta property="fb:app_id" content="1033113360129199" />
        <SlideMain slides={this.slides()} event={event} />
      </div>
    )
  }
}
