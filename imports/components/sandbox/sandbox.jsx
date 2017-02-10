import React, { Component } from "react";
import moment from "moment";

import CreateContainer from "./create_container.jsx";

import Title from "../events/create/title.jsx";
import ImageForm from "../public/img_form.jsx";
import Editor from "../public/editor.jsx";
import DateTimeSelector from "../public/datetime_selector.jsx";
import Location from "../events/create/location_select.jsx";

import BracketsPanel from "../events/create/module_dropdowns/brackets.jsx";

// Emulation of implementation of a create container.

export default class Sandbox extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  create() {
    console.log(this.refs.create.value());
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
      // {
      //   name: "Stream",
      //   icon: "video-camera",
      //   subItems: [
      //     {
      //       name: "Name",
      //       content: (
      //         <input type="text" />
      //       )
      //     }
      //   ],
      //   toggle: true
      // },
      // {
      //   name: "Crowdfunding",
      //   icon: "usd",
      //   subItems: [
      //     {
      //       name: "Name",
      //       content: (
      //         <span>$$$</span>
      //       )
      //     }
      //   ],
      //   toggle: true
      // }
    ]
  }

  render() {
    return (
      <div className="col">
        <CreateContainer items={this.items()} ref="create" />
        <div className="row" style={{marginTop: 20}}>
          <button onClick={this.create.bind(this)}>
            Publish
          </button>
        </div>
      </div>
    )
  }
}
