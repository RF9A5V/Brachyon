import React, { Component } from "react";

import SlideMain from "/imports/components/events/preview/slides/slide_main.jsx";

import Leagues from "/imports/api/leagues/league.js";

import MainSlide from "./show/main.jsx";
import EventSlide from "./show/events.jsx";
import LeaderboardSlide from "./show/leaderboards.jsx";

export default class LeagueShowPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      league: Meteor.subscribe("league", props.params.slug, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false
    }
  }

  componentWillUnmount() {
    this.state.league.stop();
  }

  slides() {
    var pages = [
      {
        name: "Home",
        component: MainSlide
      },
      {
        name: "Events",
        component: EventSlide
      },
      {
        name: "Leaderboard",
        component: LeaderboardSlide
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
        <SlideMain slides={this.slides()} event={ Leagues.findOne() } />
      </div>
    )
  }
}
