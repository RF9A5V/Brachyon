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

  constructor(props) {
    super(props);
    this.state = {
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
      hasLoaded: false
    }
  }

  componentWillUnmount(){
    // FB Tags
    document.querySelector("[property='og:title']").setAttribute("content", "Brachyon");
    document.querySelector("[property='og:description']").setAttribute("content", "Beyond the Brackets");
    document.querySelector("[property='og:image']").setAttribute("content", "/images/logo.png");
    document.querySelector("[property='og:url']").setAttribute("content", window.location.href);

    // Twitter Tags
    document.querySelector("[name='twitter:title']").setAttribute("content", "Brachyon");
    document.querySelector("[name='twitter:description']").setAttribute("content", "Brachyon - Beyond the Brackets");
    document.querySelector("[name='twitter:image']").setAttribute("content", "/images/logo.png");

    this.state.event.stop();
    this.state.users.stop();
    this.state.sponsors.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  populateMetaTags() {
    var event = this.event();
    // FB Tags
    document.querySelector("[property='og:title']").setAttribute("content", event.details.name);
    document.querySelector("[property='og:description']").setAttribute("content", this.fbDescriptionParser(event.details.description));
    document.querySelector("[property='og:image']").setAttribute("content", this.imgOrDefault());
    document.querySelector("[property='og:url']").setAttribute("content", window.location.href);

    // Twitter Tags
    document.querySelector("[name='twitter:title']").setAttribute("content", event.details.name);
    document.querySelector("[name='twitter:description']").setAttribute("content", this.fbDescriptionParser(event.details.description));
    document.querySelector("[name='twitter:image']").setAttribute("content", this.imgOrDefault());

    this.setState({
      hasLoaded: true
    })
  }

  fbDescriptionParser(description) {
    var startIndex = description.indexOf("<p>");
    var endIndex = description.indexOf("</p>", startIndex);
    var tempDesc = description.substring(startIndex + 3, endIndex);
    if(tempDesc.length > 200) {
      tempDesc = tempDesc.substring(0, 196) + "...";
    }
    return tempDesc;
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
    return event.details.bannerUrl ? event.details.bannerUrl : "/images/logo.png";
  }

  render() {
    if(!this.state.isReady){
      return (
        <div>Loading...</div>
      )
    }
    else {
      if(!this.state.hasLoaded){
        this.populateMetaTags();
      }
    }
    var event = this.event();
    return (
      <div className="box col" style={{flexFlow: "row", position: "relative"}}>
        <SlideMain slides={this.slides()} event={event} />
      </div>
    )
  }
}
