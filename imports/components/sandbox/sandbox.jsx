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

import { LeagueBanners } from "/imports/api/leagues/banners.js";

import CreateContainer from "./create_container.jsx";



// Emulation of implementation of a create container.

export default class Sandbox extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  create() {
    var obj = this.refs.create.value();
    console.log(obj);
    obj.details.name = obj.details.name.title + " " + obj.details.name.season;
    var img = null;
    if(obj.details.image) {
      img = {};
      img.file = obj.details.image.image;
      img.meta = obj.details.image.meta;
      img.type = obj.details.image.type;
      delete obj.details.image;
    }
    Meteor.call("leagues.create", obj, (err, slug) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        if(img) {
          img.meta.slug = slug;
          LeagueBanners.insert({
            file: img.file,
            isBase64: true,
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
            content: LocationForm
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
      }
    ]
  }

  render() {
    return (
      <div className="col">
        <CreateContainer items={this.items()} ref="create" />
        <div className="row center" style={{marginTop: 20}}>
          <button onClick={this.create.bind(this)}>
            Publish
          </button>
        </div>
      </div>
    )
  }
}
