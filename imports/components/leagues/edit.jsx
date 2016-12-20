import React, { Component } from "react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import { DetailsPanel, LeagueNameInput, LeagueDescription, LeagueLocation, LeagueImage } from "./edit/details.jsx";
import { BracketsPanel, LeagueBracketForm } from "./edit/brackets.jsx";
import { EventsPanel, LeagueEvent } from "./edit/events.jsx";

import Leagues from "/imports/api/leagues/league.js";

export default class EditLeagueScreen extends Component {

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

  detailItems(league) {
    return {
      icon: "file-text",
      text: "Details",
      subitems: [
        {
          text: "Main",
          component: DetailsPanel
        },
        {
          text: "Name",
          component: LeagueNameInput,
          args: {
            name: league.details.name
          }
        },
        {
          text: "Description",
          component: LeagueDescription,
          args: {
            description: league.details.description
          }
        },
        {
          text: "Location",
          component: LeagueLocation,
          args: {
            location: league.details.location
          }
        },
        {
          text: "Image",
          component: LeagueImage,
          args: {
            image: league.details.bannerUrl
          }
        }
      ]
    }
  }

  bracketItems(league) {
    return {
      icon: "sitemap",
      text: "Brackets",
      subitems: [
        {
          text: "Overview",
          component: BracketsPanel
        },
        {
          text: "Bracket",
          component: LeagueBracketForm,
          args: {
            bracket: league.brackets,
            game: league.game
          }
        }
      ]
    }
  }

  eventItems(league) {
    return {
      icon: "cog",
      text: "Events",
      subitems: [
        {
          text: "Overview",
          component: EventsPanel
        }
      ].concat(league.events.map(e => {
        var event = Events.findOne({ slug: e })
        return {
          text: event.details.name,
          component: LeagueEvent,
          args: {
            name: event.details.name,
            date: event.details.datetime
          }
        }
      }))
    }
  }

  items() {
    var league = Leagues.findOne();
    return [
      this.detailItems(league),
      this.bracketItems(league),
      this.eventItems(league)
    ];
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div className="box">
        <TabController items={this.items()} />
      </div>
    )
  }
}
