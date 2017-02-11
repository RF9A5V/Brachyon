import React, { Component } from "react";

import SlideMain from "/imports/components/events/preview/slides/slide_main.jsx";

import Leagues from "/imports/api/leagues/league.js";

import HomeSlide from "./show/slides/main/home.jsx";
import EventSlide from "./show/events.jsx";
import LeaderboardSlide from "./show/leaderboards.jsx";
import TiebreakerSlide from "./show/tiebreaker.jsx";
import StreamSlide from "./show/stream.jsx";

export default class LeagueShowPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      league: Meteor.subscribe("league", props.params.slug, {
        onReady: () => {
          this.setState({ ready: true });
          this.populateMetaTags();
        }
      }),
      ready: false
    }
  }

  imgOrDefault() {
    var league = Leagues.findOne();
    if(league.details.bannerUrl) {
      return league.details.bannerUrl;
    }
    return "/images/brachyon_logo.png";
  }

  populateMetaTags() {
    var league = Leagues.findOne();
    // FB Tags
    document.querySelector("[property='og:title']").setAttribute("content", league.details.name);
    document.querySelector("[property='og:description']").setAttribute("content", this.fbDescriptionParser(league.details.description));
    document.querySelector("[property='og:image']").setAttribute("content", this.imgOrDefault());
    document.querySelector("[property='og:url']").setAttribute("content", window.location.href);

    // Twitter Tags
    document.querySelector("[name='twitter:title']").setAttribute("content", league.details.name);
    document.querySelector("[name='twitter:description']").setAttribute("content", this.fbDescriptionParser(league.details.description));
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

  componentWillUnmount() {
    this.state.league.stop();

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

  slides() {
    var league = Leagues.findOne();
    var pages = [
      {
        name: "Home",
        slides: [
          {
            component: HomeSlide,
            args: {
              name: "title"
            }
          },
          {
            component: HomeSlide,
            args: {
              name: "change!"
            }
          }
        ]
      },
      {
        name: "Events",
        slides: [
          {
            component: EventSlide
          }
        ]
      }
    ];
    return pages;
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div className="box col">
        <SlideMain slides={this.slides()} event={ Leagues.findOne() } baseUrl={"/league/" + Leagues.findOne().slug + "/"} slide={this.props.params.slide} />
      </div>
    )
  }
}
