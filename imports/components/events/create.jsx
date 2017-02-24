import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import Title from "./create/title.jsx";
import ImageForm from "../public/img_form.jsx";
import Editor from "../public/editor.jsx";
import DateTimeSelector from "../public/datetime_selector.jsx";
import Location from "../events/create/location_select.jsx";

import BracketsPanel from "../events/create/module_dropdowns/brackets.jsx";

import StreamPanel from "../events/create/module_dropdowns/stream.jsx";

import { Banners } from "/imports/api/event/banners.js"

// Emulation of implementation of a create container.

export default class EventCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  create() {
    var obj = this.refs.create.value();
    Object.keys(obj).forEach(key1 => {
      if(obj[key1] == null) {
        delete obj[key1];
      }
    })

    var imgRef;
    if(obj.details.image != null) {
      imgRef = {
        file: obj.details.image.image,
        type: obj.details.image.type,
        meta: obj.details.image.meta
      }
    }
    delete obj.details.image;
    Meteor.call("events.create", obj, (err, event) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        var href = `/event/${event}`;
        if(imgRef) {
          imgRef.meta.eventSlug = event;
          Banners.insert({
            file: imgRef.file,
            meta: imgRef.meta,
            onUploaded: (err, data) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              toastr.success("Successfully created event!");
              browserHistory.push(href);
            }
          })
        }
        else {
          browserHistory.push(href);
        }
      }
    })

  }

  items() {
    return [
      {
        name: "Details",
        icon: "file",
        key: "details",
        subItems: [
          {
            name: "Title",
            key: "name",
            content: (
              Title
            )
          },
          {
            name: "Location",
            key: "location",
            content: (
              Location
            )
          },
          {
            name: "Description",
            key: "description",
            content: (
              Editor
            )
          },
          {
            name: "Date",
            key: "datetime",
            content: (
              DateTimeSelector
            )
          },
          {
            name: "Banner",
            key: "image",
            content: (
              ImageForm
            ),
            args: {
              aspectRatio: 16/9
            }
          }
        ],
        toggle: false
      },
      {
        name: "Brackets",
        icon: "sitemap",
        key: "brackets",
        subItems: [
          {
            name: "Name",
            key: "brackets",
            content: (
              BracketsPanel
            )
          }
        ],
        toggle: true
      },
      {
        name: "Stream",
        icon: "video-camera",
        key: "stream",
        subItems: [
          {
            name: "Name",
            key: "stream",
            content: (
              StreamPanel
            )
          }
        ],
        toggle: true
      }
    ]
  }

  actions() {
    return [
      {
        name: "Publish",
        action: this.create.bind(this)
      }
    ]
  }

  render() {
    return (
      <div className="col col-1" style={{padding: 20}}>
        <CreateContainer items={this.items()} actions={this.actions()} ref="create" />
      </div>
    )
  }
}
