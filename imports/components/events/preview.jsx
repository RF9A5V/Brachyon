import React, { Component } from "react"
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import DescriptionPage from "./preview/slides/description.jsx";

import BracketPage from "./preview/slides/brackets.jsx";
import BracketOverview from "./preview/slides/bracket_overview.jsx";
import BracketDetails from "./preview/slides/bracket_details.jsx";

import CFPage from "./preview/slides/crowdfunding.jsx";
import StreamPage from "./preview/slides/stream.jsx";

import Instances from "/imports/api/event/instance.js";

import { generateMetaTags, resetMetaTags } from "/imports/decorators/meta_tags.js";

class PreviewEventScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false
    }
  }

  componentWillUnmount(){
    resetMetaTags();
  }

  event() {
    return Events.find().fetch()[0];
  }

  populateMetaTags() {
    var event = this.event();

    var title = event.details.name;
    var desc = this.fbDescriptionParser(event.details.description);
    var img = this.imgOrDefault();
    var url = window.location.href;

    generateMetaTags(title, desc, img, url);

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

  pages() {
    var event = this.event();
    var instance = Instances.findOne();
    var pages = ["Home"];
    if(instance.brackets) {
      pages.push("Brackets");
    }
    if(event.stream) {
      pages.push("Stream");
    }
    return (key) => {
      this.refs.slider.setMain(pages.indexOf(key));
    }
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
      var slides = [];
      if(instance.brackets.length > 1) {
        slides.push({
          component: BracketOverview,
          args: {
            onBracketSelect: (i) => {
              this.refs.slider.setCurrent(i)
            }
          }
        })
      }
      slides = slides.concat(instance.brackets.map((b, i) => {
        return {
          component: BracketDetails,
          args: {
            index: i
          }
        }
      }))
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
    return event.details.bannerUrl ? event.details.bannerUrl : "/images/bg.jpg";
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
        <SlideMain slides={this.slides()} slide={this.props.params.slide || ""} baseUrl={"/event/" + event.slug + "/"} color="#00BDFF" ref="slider" backgroundImage={this.imgOrDefault()} pages={this.pages()} />
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
