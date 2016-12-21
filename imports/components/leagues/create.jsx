import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import ModuleBlock from "../events/create/module_block.jsx";
import DetailsPanel from "./create/details_panel.jsx";
import BracketsPanel from "./create/brackets_panel.jsx";
import EventsPanel from "./create/events_panel.jsx";

import { LeagueBanners } from "/imports/api/leagues/banners.js";

export default class CreateLeagueScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moduleState: {
        details: {
          active: true
        },
        brackets: {
          active: true
        },
        events: {
          active: true
        },
        stream: {
          active: false
        },
        crowdfunding: {
          active: false
        },
      },
      attrs: {
        details: {
          season: 1
        },
        events: [{ date: moment().toDate() }],
        brackets: {
          format: {
            baseFormat: "single_elim"
          },
          scoring: "linear",
          gameObj: null
        }
      },
      currentItem: "details"
    }
  }

  availableModules() {
    return [
      {
        name: "details",
        icon: "file-text",
        requiresReview: false,
        selected: this.state.moduleState["details"].active
      },
      {
        name: "brackets",
        icon: "sitemap",
        requiresReview: false,
        selected: this.state.moduleState["brackets"].active
      },
      {
        name: "events",
        icon: "cog",
        requiresReview: false,
        selected: true
      },
      {
        name: "stream",
        icon: "video-camera",
        requiresReview: false,
        selected: this.state.moduleState["stream"].active
      },
      {
        name: "crowdfunding",
        icon: "usd",
        requiresReview: true,
        selected: this.state.moduleState["crowdfunding"].active
      }
    ];
  }

  modulePanels() {
    var modules = this.availableModules();
    var keys = Object.keys(modules);
    var generator = (value) => {
      return () => {
        if(value == "details" || value == "brackets") {
          return;
        }
        if(value == "crowdfunding") {
          return toastr.warning("Under construction!", "Warning!");
        }
        this.state.moduleState[value].active = !this.state.moduleState[value].active;
        this.forceUpdate();
      }
    }
    return keys.map((key, index) => {
      var mod = modules[key];
      return (
        <ModuleBlock
          modName={mod.name}
          icon={mod.icon}
          isActive={this.state.currentItem == mod.name}
          callback={() => {
            this.setState({
              currentItem: mod.name
            })
          }}
          isOn={this.state.moduleState[mod.name].active}
          onToggle={generator(mod.name)}
          toggleable={mod.name == "details" || mod.name == "brackets" || mod.name == "events"}
        />
      );
    })
  }

  currentPanel() {
    var item = (
      <div></div>
    )
    switch(this.state.currentItem) {
      case "details":
        item = <DetailsPanel attrs={this.state.attrs} />
        break;
      case "events":
        item = <EventsPanel attrs={this.state.attrs} />
        break;
      case "brackets":
        item = <BracketsPanel attrs={this.state.attrs} />
        break;
      default:
        break;
    }
    return (
      <div style={{padding: 20, backgroundColor: "#666"}}>
        { item }
      </div>
    )
  }

  createLeague() {
    var attrs = this.state.attrs;
    if(attrs.details.name == null) {
      return toastr.error("League name can't be empty!");
    }
    if(attrs.details.description == null) {
      return toastr.error("League description can't be empty!");
    }
    if(attrs.brackets.gameObj == null) {
      return toastr.error("League bracket game can't be empty!");
    }
    attrs.events.forEach((e, i) => {
      if(moment(e.date).isBefore(moment())) {
        return toastr.error("Event start date can't be before now!");
      }
      if(e.name == null) {
        e.name = attrs.details.name + " " + (i + 1);
      }
    });
    var img = null;
    if(attrs.details.image) {
      img = {};
      img.file = attrs.details.image.file;
      img.meta = attrs.details.image.meta;
    }
    delete attrs.details.image;
    Meteor.call("leagues.create", attrs, (err, slug) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        if(img) {
          img.meta.slug = slug;
          var dataSeg = img.file.substring(img.file.indexOf("/"), img.file.indexOf(";")).slice(1);
          LeagueBanners.insert({
            file: img.file,
            isBase64: true,
            meta: img.meta,
            fileName: slug + "." + dataSeg,
            onUploaded: (err, data) => {
              console.log("woo?")
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              toastr.success("Successfully created league!", "Success!");
              browserHistory.push("/")
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

  render() {
    return (
      <div className="box col" style={{padding: 20}}>
        <div className="row" style={{marginBottom: 10}}>
          {
            this.modulePanels()
          }
        </div>
        <div>
          {
            this.currentPanel()
          }
        </div>
        <div className="row center" style={{marginTop: 10}}>
          <button onClick={this.createLeague.bind(this)}>Submit</button>
        </div>
      </div>
    )
  }
}
