import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";

import SlideMain from "/imports/components/events/preview/slides/slide_main.jsx";

import Leagues from "/imports/api/leagues/league.js";

import HomeSlide from "./show/slides/main/home.jsx";
import DescriptionSlide from "./show/slides/main/description.jsx";

import EventSlide from "./show/events.jsx";
import LeaderboardSlide from "./show/leaderboards.jsx";
import TiebreakerSlide from "./show/tiebreaker.jsx";
import StreamSlide from "./show/stream.jsx";

import { generateMetaTags, resetMetaTags } from "/imports/decorators/meta_tags.js";

class LeagueShowPage extends Component {

  componentWillMount() {
    this.populateMetaTags();
  }

  imgOrDefault() {
    var league = Leagues.findOne();
    if(league.details.bannerUrl) {
      return league.details.bannerUrl;
    }
    return "/images/bg.jpg";
  }

  populateMetaTags() {
    var league = Leagues.findOne();

    var title = league.details.name;
    var desc = this.fbDescriptionParser(league.details.description);
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

  componentWillUnmount() {
    resetMetaTags();
  }

  slides() {
    var league = Leagues.findOne();
    var pages = [
      {
        name: "Home",
        slides: [
          {
            component: HomeSlide
          },
          {
            component: DescriptionSlide
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
      },
      {
        name: "Leaderboard",
        slides: [
          {
            component: LeaderboardSlide
          }
        ]
      }
    ];
    if(league.tiebreaker && !league.complete) {
      pages.push({
        name: "Tiebreaker",
        slides: [
          {
            component: TiebreakerSlide
          }
        ]
      })
    }
    if(league.stream) {
      pages.push({
        name: "Stream",
        slides: [
          {
            component: StreamSlide
          }
        ]
      })
    }
    return pages;
  }

  render() {
    if(!this.props.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div className="box col">
        <SlideMain slides={this.slides()} baseUrl={"/league/" + Leagues.findOne().slug + "/"} slide={this.props.params.slide} color="#FF6000" backgroundImage={this.imgOrDefault()} />
      </div>
    )
  }
}

export default createContainer(props => {
  const slug = props.params.slug;
  const leagueHandle = Meteor.subscribe("league", slug);
  return {
    ready: leagueHandle.ready()
  }
}, LeagueShowPage)
