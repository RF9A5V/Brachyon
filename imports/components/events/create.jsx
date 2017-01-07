import React, { Component } from "react";

import { browserHistory } from "react-router";

import DetailsPanel from "./create/details.jsx";
import CrowdfundingPanel from "./create/module_dropdowns/crowdfunding.jsx";
import BracketsPanel from "./create/module_dropdowns/brackets.jsx";
import BotPanel from "./create/module_dropdowns/bot.jsx";
import PromotionPanel from "./create/module_dropdowns/promotion.jsx";
import StreamPanel from "./create/module_dropdowns/stream.jsx";
import ModuleBlock from "./create/module_block.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class EventCreateScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moduleState: {
        details: {
          active: true
        },
        brackets: {
          active: false
        },
        stream: {
          active: false
        },
        crowdfunding: {
          active: false
        },
      },
      currentItem: "details",
      creator: {
        type: "user",
        id: Meteor.userId()
      },
      organizations: Meteor.subscribe("userOrganizations", Meteor.userId(), {
        onReady: () => { this.setState({ ready: true }) }
      }),
      ready: false
    }
  }

  componentWillUnmount() {
    this.state.organzations.stop();
  }

  panels() {
    var generator = (value) => {
      return () => {
        this.state.moduleState[value].active = !this.state.moduleState[value].active;
        this.forceUpdate();
      }
    }
    return {
      details: (<DetailsPanel ref="details" style={{height: this.state.currentItem == "details" ? "initial" : 0, overflowY: "hidden"}} />),
      brackets: (<BracketsPanel selected={this.state.moduleState["brackets"].active} ref="brackets" style={{height: this.state.currentItem == "brackets" ? "initial" : 0, overflowY: "hidden"}} onToggle={generator("brackets")} />),
      crowdfunding: (<CrowdfundingPanel selected={this.state.moduleState["crowdfunding"].active} ref="crowdfunding" style={{height: this.state.currentItem == "crowdfunding" ? "initial" : 0, overflowY: "hidden"}} onToggle={generator("crowdfunding")} />),
      stream: (<StreamPanel ref="stream" selected={this.state.moduleState["stream"].active} style={{height: this.state.currentItem == "stream" ? "initial" : 0, overflowY: "hidden"}} onToggle={generator("stream")} />)
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

  accordionItems() {
    var moduleItems = [];
    var modules = this.availableModules();
    var keys = Object.keys(modules);
    var panels = this.panels();
    for(var i in modules){
      moduleItems.push({
        title: modules[i].name[0].toUpperCase() + modules[i].name.slice(1),
        content: (
          panels[modules[i].name]
        ),
        active: modules[i].name == this.state.currentItem
      })
    }
    return moduleItems;
  }

  submit(e) {
    e.preventDefault();
    var refKeys = Object.keys(this.refs);
    var args = {};
    var unpub = false;
    var unpubList = ["crowdfunding"];
    for(var i in refKeys) {
      var key = refKeys[i];
      if(this.state.moduleState[key].active) {
        args[key] = this.refs[key].value();
        if(unpubList.indexOf(key) >= 0) {
          unpub = true;
        }
      }
    }

    var imgRef = args["details"]["image"];
    delete args["details"]["image"];

    args.creator = this.state.creator;

    Meteor.call("events.create", args, (err, event) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        var href = unpub ? `/events/${event}/edit` : `/events/${event}/show`;
        imgRef.setMeta("eventSlug", event);
        if(imgRef.hasValue()) {
          imgRef.value(() => {
            browserHistory.push(href);
          });
        }
        else {
          browserHistory.push(href);
        }
      }
    })
  }

  buttons() {
    var reviewRequired = false;
    return (
      <div style={{marginBottom: 20}}>
        {
          reviewRequired ? (
            <button onClick={this.submit.bind(this)}>Advanced Options</button>
          ) : (
            <button onClick={this.submit.bind(this)}>Publish</button>
          )
        }
      </div>
    );
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
        if(value == "details") {
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
        />
      );
    })
  }

  render() {
    var self = this;
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div className='box'>
        <div className='col' style={{padding: 20}}>
          <div className="row flex-pad x-center" style={{marginBottom: 20}}>
            <div className="row">
            {
              this.modulePanels()
            }
            </div>
            <div className="col" style={{padding: 10, backgroundColor: "#666"}}>
              <span style={{marginBottom: 5}}>Create As</span>
              <select defaultValue={0} onChange={this.onTypeSelect.bind(this)}>
                <option value={0}>User - {Meteor.user().username}</option>
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
          </div>
          <div className="col" style={{marginBottom: 20}}>
            {
              this.accordionItems().map(function(item){
                return (
                  <div style={{backgroundColor: "#666", padding: item.active ? 20 : 0}}>
                    {item.content}
                  </div>
                );
              })
            }
          </div>
          <div className="row center">
            {
              this.buttons()
            }
          </div>
        </div>
      </div>
    )
  }
}
