import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import Title from "/imports/components/leagues/create/title.jsx";
import Editor from "/imports/components/public/editor.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";
import LocationForm from "/imports/components/events/create/location_select.jsx";

import BracketsPanel from "/imports/components/leagues/create/brackets_panel.jsx";
import EventsPanel from "/imports/components/leagues/create/events_panel.jsx";
import StreamPanel from "/imports/components/leagues/create/stream_panel.jsx";
import TicketsPanel from "/imports/components/leagues/create/tickets_panel.jsx";

import { LeagueBanners } from "/imports/api/leagues/banners.js";

import CreateContainer from "/imports/components/public/create/create_container.jsx";
import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class LeagueCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      initReady: true
    };
  }

  create() {
    var obj = this.refs.create.value();
    console.log(obj)

    obj.details.name = obj.details.name.title + " " + obj.details.name.season;
    var img = null;
    if(obj.details.image) {
      img = {};
      img.file = obj.details.image.image;
      img.meta = obj.details.image.meta;
      img.type = obj.details.image.type;
    }
    delete obj.details.image;
    Meteor.call("leagues.create", obj, (err, slug) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        if(img) {
          img.meta.slug = slug;
          LeagueBanners.insert({
            file: img.file,
            meta: img.meta,
            fileName: slug + "." + img.type,
            onUploaded: (err, data) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              toastr.success("Successfully created league!", "Success!");
              browserHistory.push("/");
            }
          })
        }
        else {
          toastr.success("Successfully created league!", "Success!");
          browserHistory.push("/")
        }
      }
    });

  }

  items() {
    return [
      {
        name: "Details",
        key: "details",
        icon: "file",
        subItems: [
          {
            name: "Title",
            key: "name",
            content: Title
          },
          {
            name: "Description",
            key: "description",
            content: Editor
          },
          {
            name: "Location",
            key: "location",
            content: LocationForm,
            args: {
              online: false
            }
          },
          {
            name: "Banner",
            key: "image",
            content: ImageForm,
            args: {
              aspectRatio: 16/9
            }
          }
        ]
      },
      {
        name: "Brackets",
        key: "brackets",
        icon: "sitemap",
        subItems: [
          {
            name: "Brackets",
            key: "brackets",
            content: BracketsPanel
          }
        ]
      },
      {
        name: "Events",
        key: "events",
        icon: "cog",
        subItems: [
          {
            name: "Events",
            key: "events",
            content: EventsPanel
          }
        ]
      },
      {
        name: "Stream",
        key: "stream",
        icon: "video-camera",
        subItems: [
          {
            name: "Stream",
            key: "stream",
            content: StreamPanel
          }
        ],
        toggle: true
      },
      // {
      //   name: "Tickets",
      //   key: "tickets",
      //   icon: "ticket",
      //   subItems: [
      //     {
      //       name: "Main",
      //       key: "tickets",
      //       content: TicketsPanel
      //     }
      //   ],
      //   toggle: true
      // }
    ]
  }

  actions() {
    return [
      {
        name: "Publish",
        icon: "check",
        action: this.create.bind(this)
      }
    ]
  }

  render() {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.initReady} onReady={() => { this.setState({ready: true}) }} />
      )
    }
    return (
      <div className="col" style={{padding: 10}}>
        <CreateContainer items={this.items()} actions={this.actions()} ref="create" />
      </div>
    )
  }
}
