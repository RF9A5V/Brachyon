import React, { Component } from "react"
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import DescriptionPage from "./preview/slides/description.jsx";

import BracketPage from "./preview/slides/brackets.jsx";
import BracketDetails from "./preview/slides/bracket_details.jsx";

import CFPage from "./preview/slides/crowdfunding.jsx";
import StreamPage from "./preview/slides/stream.jsx";

import Instances from "/imports/api/event/instance.js";

class PreviewEventScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false
    }
  }

  componentWillUnmount(){
    // FB Tags
    document.querySelector("[property='og:title']").setAttribute("content", "Brachyon");
    document.querySelector("[property='og:description']").setAttribute("content", "Beyond the Brackets");
    document.querySelector("[property='og:image']").setAttribute("content", "/images/brachyon_logo.png");
    document.querySelector("[property='og:url']").setAttribute("content", window.location.href);

    // Twitter Tags
    document.querySelector("[name='twitter:title']").setAttribute("content", "Brachyon");
    document.querySelector("[name='twitter:description']").setAttribute("content", "Brachyon - Beyond the Brackets");
    document.querySelector("[name='twitter:image']").setAttribute("content", "/images/brachyon_logo.png");
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
        slides: [
          {
            component: TitlePage
          },
          {
            component: DescriptionPage
          }
        ]
      }
    ];
    if(instance.brackets) {
      var slides = instance.brackets.map((b, i) => {
        return {
          component: BracketDetails,
          args: {
            index: i
          }
        }
      })
      pages.push({
        name: "Brackets",
        slides
      });
    }
    if(event.stream) {
      pages.push({
        name: "Stream",
        slides: [
          {
            component: StreamPage
          }
        ]
      });
    }
    return pages;
  }

  imgOrDefault() {
    var event = this.event();
    return event.details.bannerUrl ? event.details.bannerUrl : "/images/logo.png";
  }

  render() {
    if(!this.props.ready){
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
      <div className="box col">
        <SlideMain slides={this.slides()} slide={this.props.params.slide || ""} baseUrl={"/event/" + event.slug + "/"} color="#00BDFF" />
      </div>
    )
  }
}

export default createContainer(({params}) => {
  const eventSub = Meteor.subscribe("event", params.slug);
  const users = Meteor.subscribe("event_participants", params.slug);
  return {
    ready: eventSub.ready() && users.ready()
  }
}, PreviewEventScreen)
