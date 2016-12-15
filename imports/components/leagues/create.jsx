import React, { Component } from "react";

import ModuleBlock from "../events/create/module_block.jsx";
import DetailsPanel from "./create/details_panel.jsx";
import EventsPanel from "./create/events_panel.jsx";

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

        },
        events: [{}]
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
        item = <DetailsPanel setValue={this.updateAttrs.bind(this)} attrs={this.state.attrs} />
        break;
      case "events":
        item = <EventsPanel setValue={this.updateAttrs.bind(this)} attrs={this.state.attrs} />
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

  updateAttrs() {
    var obj = this.state.attrs;
    var temp = this.state.attrs;
    for(var i = 0; i < arguments.length - 2; i ++) {
      console.log(obj);
      temp = temp[arguments[i]];
    }
    obj[arguments[arguments.length - 2]] = obj[arguments[arguments.length - 1]];
    this.state.attrs = obj;
    this.forceUpdate();
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
      </div>
    )
  }
}
