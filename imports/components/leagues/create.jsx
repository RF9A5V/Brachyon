import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import ModuleBlock from "../events/create/module_block.jsx";
import DetailsPanel from "./create/details_panel.jsx";
import BracketsPanel from "./create/brackets_panel.jsx";
import EventsPanel from "./create/events_panel.jsx";
import StreamPanel from "./create/stream_panel.jsx";
import CrowdfundingPanel from "/imports/components/events/create/module_dropdowns/crowdfunding.jsx";

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
        events: [{ date: moment().add(1, "hour").startOf("hour").toDate() }],
        brackets: {
          format: {
            baseFormat: "single_elim"
          },
          scoring: "linear",
          gameObj: null
        }
      },
      creator: {
        type: "user",
        id: Meteor.userId()
      },
      organizations: Meteor.subscribe("userOrganizations", Meteor.userId(), {
        onReady: () => { this.setState({ ready: true }) }
      }),
      currentItem: "details",
      ready: false
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

  onTypeSelect(e) {
    if(e.target.value == 0) {
      this.setState({
        creator: {
          type: "user",
          id: Meteor.userId()
        }
      });
    }
    else {
      this.setState({
        creator: {
          type: "organization",
          id: e.target.value
        }
      })
    }
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
          if(!Meteor.isDevelopment) {
            return toastr.warning("Under construction!", "Warning!");
          }
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
    var generator = (value) => {
      return () => {
        if(value == "details" || value == "brackets") {
          return;
        }
        if(value == "crowdfunding") {
          if(!Meteor.isDevelopment) {
            return toastr.warning("Under construction!", "Warning!");
          }
        }
        this.state.moduleState[value].active = !this.state.moduleState[value].active;
        this.forceUpdate();
      }
    }
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
      case "stream":
        item = <StreamPanel attrs={this.state.attrs} selected={this.state.moduleState.stream.active} onToggle={() => { this.state.moduleState.stream.active = !this.state.moduleState.stream.active; this.forceUpdate(); }} />
        break;
      case "crowdfunding":
        item = <CrowdfundingPanel attrs={this.state.attrs} selected={this.state.moduleState.crowdfunding.active} onToggle={generator("crowdfunding")} />
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
    attrs.creator = this.state.creator;
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

  render() {
    if(!this.state.ready) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div className="box col" style={{padding: 20}}>
        <div className="row flex-pad x-center" style={{marginBottom: 10}}>
          <div className="row">
            {
              this.modulePanels()
            }
          </div>
          {
            Organizations.find().fetch().length > 0 ? (
              <div className="col" style={{padding: 10, backgroundColor: "#666"}}>
                <span style={{marginBottom: 5}}>Create As</span>
                <select defaultValue={0} onChange={this.onTypeSelect.bind(this)}>
                  <option value={0}>User - {Meteor.users.findOne().username}</option>
                  {
                    Organizations.find().map(o => {
                      return (
                        <option value={o._id}>
                          Organization - { o.name }
                        </option>
                      )
                    })
                  }
                </select>
              </div>
            ) : (
              ""
            )
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
