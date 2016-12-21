import React, { Component } from "react";
import moment from "moment";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import { DetailsPanel, LeagueNameInput, LeagueDescription, LeagueLocation, LeagueImage } from "./edit/details.jsx";
import { BracketsPanel, LeagueBracketForm } from "./edit/brackets.jsx";
import { EventsPanel, LeagueEvent } from "./edit/events.jsx";
import SubmitPanel from "./edit/submit.jsx";

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
      ready: false,
      changelog: {}
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
            name: league.details.name,
            season: league.details.season,
            changelog: this.state.changelog
          }
        },
        {
          text: "Description",
          component: LeagueDescription,
          args: {
            description: league.details.description,
            changelog: this.state.changelog
          }
        },
        {
          text: "Location",
          component: LeagueLocation,
          args: {
            location: league.details.location,
            changelog: this.state.changelog
          }
        },
        {
          text: "Image",
          component: LeagueImage,
          args: {
            image: league.details.bannerUrl,
            changelog: this.state.changelog
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
            game: league.game,
            changelog: this.state.changelog
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
      ].concat(league.events.map((e, i) => {
        var event = Events.findOne({ slug: e });
        var beforeSlug = league.events[i - 1];
        var startAt = i == 0 ? Date() : Events.findOne({ slug: beforeSlug }).details.datetime;
        var check = this.state.changelog.events;
        if(check && check[beforeSlug] && check[beforeSlug].date) {
          startAt = check[beforeSlug].date;
        }
        if(moment(startAt).endOf("day").isAfter(moment(event.details.datetime))) {
          if(!this.state.changelog.events) {
            this.state.changelog.events = {};
          }
          if(!this.state.changelog.events[e]) {
            this.state.changelog.events[e] = {};
          }
          if(!this.state.changelog.events[e].date || moment(this.state.changelog.events[e].date).isBefore(moment(startAt).startOf("day"))) {
            this.state.changelog.events[e].date = moment(startAt).add(1, "day").toDate();
          }
        }
        var name = league.details.name;
        var log = this.state.changelog.league;
        if(log && log.details && log.details.name) {
          name = log.details.name;
        }
        return {
          text: name + "." + league.details.season + " " + (i + 1),
          component: LeagueEvent,
          args: {
            slug: event.slug,
            name: name + "." + league.details.season + " " + (i + 1),
            date: event.details.datetime,
            changelog: this.state.changelog,
            startAt,
            forceUpdate: this.forceUpdate.bind(this)
          }
        }
      }))
    }
  }

  submitItem(league) {
    return {
      text: "Submit",
      subitems: [
        {
          component: SubmitPanel,
          args: {
            changelog: this.state.changelog
          }
        }
      ]
    }
  }

  items() {
    var league = Leagues.findOne();
    return [
      this.detailItems(league),
      this.bracketItems(league),
      this.eventItems(league),
      this.submitItem(league)
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
        <TabController items={this.items()} update={this.forceUpdate.bind(this)} />
      </div>
    )
  }
}
