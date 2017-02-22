import React, { Component } from "react";
import moment from "moment";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import CreateContainer from "/imports/components/public/create/create_container.jsx";

import LeagueNameInput from "./modules/details/name.jsx";
import LeagueDescription from "./modules/details/description.jsx";
import LeagueLocation from "./modules/details/location.jsx";
import LeagueImage from "./modules/details/image.jsx";

import { BracketsPanel, LeagueBracketForm } from "./edit/brackets.jsx";
import { EventsPanel, LeagueEvent } from "./edit/events.jsx";
import LeaderboardPanel from "./edit/leaderboard.jsx";
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

  componentWillUnmount() {
    this.state.league.stop();
  }

  componentWillReceiveProps(next) {
    this.state.ready = false;
    this.state.league.stop();
    this.state.league = Meteor.subscribe("league", next.params.slug, {
      onReady: () => {
        this.setState({ ready: true, changelog: {} })
      }
    })
  }

  detailItems(league) {
    return {
      icon: "file-text",
      name: "Details",
      key: "details",
      subItems: [
        {
          name: "Name",
          content: LeagueNameInput,
          args: {
            name: league.details.name,
            season: league.details.season
          }
        },
        {
          name: "Description",
          content: LeagueDescription,
          args: {
            description: league.details.description
          }
        },
        {
          name: "Location",
          content: LeagueLocation,
          args: {
            location: league.details.location
          }
        },
        {
          name: "Image",
          content: LeagueImage,
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

  leaderboardItems(league) {
    return {
      icon: "cog",
      text: "Leaderboard",
      subitems: [
        {
          text: "Overview",
          component: LeaderboardPanel
        }
      ]
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
      this.detailItems(league)
    ];
    // return [
    //   this.detailItems(league),
    //   this.bracketItems(league),
    //   this.eventItems(league),
    //   this.leaderboardItems(league),
    //   this.submitItem(league)
    // ];
  }

  save() {
    var attrs = this.refs.create.value();

    var imgTemp;
    if(attrs.details.image) {
      var file = attrs.details.image.image;
      imgTemp = JSON.parse(JSON.stringify(attrs.details.image));
      imgTemp.image = file;
    }
    delete attrs.details.image;

    if(league.owner == attrs.creator.id) {
      delete attrs.creator;
    }

    console.log(attrs);
    return;

    Meteor.call("leagues.edit", Leagues.findOne()._id, attrs, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated league!");
      }
    })

  }

  actions() {
    return [
      {
        name: "Save All",
        action: () => {
          console.log(this.refs.create.value());
        }
      }
    ]
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div style={{padding: 20}}>
        <CreateContainer ref="create" items={this.items()} actions={this.actions()} />
      </div>
    )
  }
}
