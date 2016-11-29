import React, { Component } from "react";

import { browserHistory } from "react-router";

import AccordionContainer from "/imports/components/public/accordion_container.jsx";
import DetailsPanel from "./create/details.jsx";
import CrowdfundingPanel from "./create/module_dropdowns/crowdfunding.jsx";
import BracketsPanel from "./create/module_dropdowns/brackets.jsx";
import BotPanel from "./create/module_dropdowns/bot.jsx";
import PromotionPanel from "./create/module_dropdowns/promotion.jsx";
import StreamPanel from "./create/module_dropdowns/stream.jsx";
import ModuleBlock from "./create/module_block.jsx";

import { Images } from "/imports/api/event/images.js";

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
      currentItem: "details"
    }
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
    var createEvent = (args) => {
      Meteor.call("events.create", args, (err, event) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          if(unpub) {
            browserHistory.push(`/events/${event}/edit`);
          }
          else {
            browserHistory.push(`/events/${event}/show`);
          }
        }
      });
    }
    if(args["details"]["image"]) {
      var img = args["details"]["image"];
      if(img.base64) {
        Images.insert({
          file: img.base64,
          isBase64: true,
          fileName: Meteor.userId(), // Weird shit until I figure out if we want to save the initial file name
          meta: img.boxData,
          onStart: () => {
            toastr.warning("Processing event...", "Warning")
          },
          onUploaded: (err, data) => {
            args["details"]["banner"] = data._id;
            delete args["details"]["image"];
            createEvent(args);
          }
        })
      }
    }
    else {
      createEvent(args);
    }
  }

  buttons() {
    // var reviewRequired = this.state.moduleBits.review.some(function(val){
    //   return val == 1;
    // });
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

  modulePanels() {
    var modules = this.availableModules();
    var keys = Object.keys(modules);
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
        />
      );
    })
  }

  render() {
    var self = this;
    return (
      <div className='box'>
        <div className='col' style={{padding: 20}}>
          <div className="row" style={{marginBottom: 20}}>
            {
              this.modulePanels()
            }
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
