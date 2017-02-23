import React, { Component } from "react";
import moment from "moment";
import { createContainer } from "meteor/react-meteor-data";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import CreateContainer from "/imports/components/public/create/create_container.jsx";

import LeagueNameInput from "./modules/details/name.jsx";
import LeagueDescription from "./modules/details/description.jsx";
import LeagueLocation from "./modules/details/location.jsx";
import LeagueImage from "./modules/details/image.jsx";

import EditBracket from "./modules/brackets/edit.jsx";

import EditEvent from "./modules/events/edit.jsx";

import EditLeaderboard from "./modules/leaderboard/edit.jsx";

import { BracketsPanel, LeagueBracketForm } from "./edit/brackets.jsx";
import { EventsPanel, LeagueEvent } from "./edit/events.jsx";
import LeaderboardPanel from "./edit/leaderboard.jsx";
import SubmitPanel from "./edit/submit.jsx";

import Leagues from "/imports/api/leagues/league.js";
import { LeagueBanners } from "/imports/api/leagues/banners.js";

class EditLeagueScreen extends Component {

  detailItems(league) {
    return {
      icon: "file-text",
      name: "Details",
      key: "details",
      subItems: [
        {
          name: "Name",
          key: "name",
          content: LeagueNameInput,
          args: {
            name: league.details.name,
            season: league.details.season
          }
        },
        {
          name: "Description",
          key: "description",
          content: LeagueDescription,
          args: {
            description: league.details.description
          }
        },
        {
          name: "Location",
          key: "location",
          content: LeagueLocation,
          args: {
            location: league.details.location
          }
        },
        {
          name: "Image",
          key: "image",
          content: LeagueImage,
          args: {
            image: league.details.bannerUrl
          }
        }
      ]
    }
  }

  bracketItems(league) {

    var attrs = league.events.map(e => {
      var event = Events.findOne({slug: e});
      return {
        eventId: event._id,
        bracket: Instances.findOne(event.instances.pop()).brackets[0]
      }
    });
    var subs = attrs.map((attr, i) => {
      return {
        name: Events.findOne(attr.eventId).details.name,
        key: i,
        content: EditBracket,
        args: attr
      }
    })

    return {
      icon: "sitemap",
      name: "Brackets",
      key: "brackets",
      subItems: subs
    }
  }

  eventItems(league) {
    var subs = league.events.map((slug, i) => {
      var event = Events.findOne({ slug });
      return {
        content: EditEvent,
        name: event.details.name,
        key: i,
        args: {
          id: event._id,
          startsAt: i == 0 ? null : Events.findOne({ slug: league.events[i - 1] }).details.datetime,
          update: this.forceUpdate.bind(this),
          index: i
        }
      }
    })

    return {
      icon: "cog",
      name: "Events",
      key: "events",
      subItems: subs
    }
  }

  leaderboardItems(league) {

    var subs = league.leaderboard.map((l, i) => {

      var event = Events.findOne({slug: league.events[i]});

      return {
        name: event.details.name,
        key: i,
        content: EditLeaderboard,
        args: {
          index: i
        }
      }
    })

    return {
      icon: "cog",
      name: "Leaderboard",
      key: "leaderboard",
      subItems: subs
    }
  }

  items() {
    var league = Leagues.findOne();
    return [
      this.detailItems(league),
      this.bracketItems(league),
      this.eventItems(league),
      this.leaderboardItems(league)
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
    var league = Leagues.findOne();

    var imgTemp;
    if(attrs.details.image) {
      var file = attrs.details.image.image;
      imgTemp = JSON.parse(JSON.stringify(attrs.details.image));
      imgTemp.image = file;
    }
    delete attrs.events;
    delete attrs.details.image;

    Object.keys(attrs.brackets).forEach(k => {
      if(!attrs.brackets[k]) {
        delete attrs.brackets[k];
      }
    });

    if(Object.keys(attrs.brackets).length == 0) {
      delete attrs.brackets;
    }

    if(league.owner == attrs.creator.id) {
      delete attrs.creator;
    }

    Meteor.call("leagues.edit", Leagues.findOne()._id, attrs, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated league!");
      }
    });

    if(imgTemp) {
      imgTemp.meta.slug = Leagues.findOne().slug;
      LeagueBanners.insert({
        file: imgTemp.image,
        meta: imgTemp.meta,
        onUploaded: (err) => {
          if(err) {
            toastr.error(err.reason);
          }
        }
      })
    }

  }

  actions() {
    return [
      {
        name: "Save All",
        action: this.save.bind(this)
      }
    ]
  }

  render() {
    if(!this.props.ready) {
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

export default createContainer(({params}) => {
  const leagueHandle = Meteor.subscribe("league", params.slug);
  return {
    ready: leagueHandle.ready()
  }
}, EditLeagueScreen)
