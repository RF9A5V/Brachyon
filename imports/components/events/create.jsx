import React, { Component } from "react";

import { browserHistory } from "react-router";

import AccordionContainer from "/imports/components/public/accordion_container.jsx";
import DetailsPanel from "./create/details.jsx";
import CrowdfundingPanel from "./create/module_dropdowns/crowdfunding.jsx";
import BracketsPanel from "./create/module_dropdowns/brackets.jsx";
import BotPanel from "./create/module_dropdowns/bot.jsx";
import PromotionPanel from "./create/module_dropdowns/promotion.jsx";
import ModuleBlock from "./create/module_block.jsx";

import { Images } from "/imports/api/event/images.js";

export default class EventCreateScreen extends Component {

  componentWillMount() {
    var modules = this.availableModules();
    this.setState({
      moduleBits: {
        nonReview: Array(modules.nonReview.length).fill(0),
        review: Array(modules.review.length).fill(0)
      }
    });
    window.addEventListener("resize", this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.forceUpdate.bind(this));
  }

  panels() {
    return {
      brackets: (<BracketsPanel ref="brackets" />),
      crowdfunding: (<CrowdfundingPanel ref="crowdfunding" />)
    }
  }

  availableModules() {
    return {
      nonReview: [
        {
          name: "brackets",
          icon: "sitemap"
        }
      ],
      review: [
        {
          name: "crowdfunding",
          icon: "usd"
        }
      ]
    }
  }

  toggleModuleState(category, index){
    if(index >= this.state.moduleBits[category].length) {
      return false;
    }
    if(this.state.moduleBits[category][index] == 0){
      this.state.moduleBits[category][index] = 1;
    }
    else {
      this.state.moduleBits[category][index] = 0;
    }
    this.forceUpdate();
  }

  accordionItems() {
    var moduleItems = [];
    var modules = this.availableModules();
    var keys = Object.keys(modules);
    var panels = this.panels();
    for(var i in modules){
      for(var j in modules[i]){
        if(this.state.moduleBits[i][j] == 1){
          moduleItems.push({
            title: modules[i][j].name[0].toUpperCase() + modules[i][j].name.slice(1),
            content: (
              panels[modules[i][j].name]
            )
          })
        }
      }
    }
    moduleItems.push({
      title: "Details",
      content: (<DetailsPanel ref="details" />)
    });
    return moduleItems;
  }

  submit(e) {
    e.preventDefault();
    var refKeys = Object.keys(this.refs);
    var args = {};
    for(var i in refKeys) {
      var key = refKeys[i];
      args[key] = this.refs[key].value();
    }
    var createEvent = (args) => {
      Meteor.call("events.create", args, (err, event) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          var reviewRequired = this.state.moduleBits.review.some(function(val){
            return val == 1;
          });
          if(reviewRequired) {
            browserHistory.push(`/events/${event}/edit`)
          }
          else {
            browserHistory.push(`/events/${event}/preview`);
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
    var reviewRequired = this.state.moduleBits.review.some(function(val){
      return val == 1;
    });
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
      return (
        <div>
          <h5 className="module-block-label">{key == "nonReview" ? ("No Review Required") : ("Review Required")}</h5>
          {
            modules[key].map((value, index) => {
              return (
                <ModuleBlock
                  category={key}
                  modName={value.name}
                  icon={value.icon}
                  index={index}
                  isActive={this.state.moduleBits[key][index] == 1}
                  callback={this.toggleModuleState.bind(this)}
                />
              )
            })
          }
        </div>
      );
    })
  }

  render() {
    var self = this;
    return (
      <div className='box'>
        <div className='col x-center'>
          <h2>Create an Event</h2>
          <div className="create-row" style={{width: window.innerWidth < 1450 ? "95%" : "85%", alignItems: window.innerWidth < 1450 ? "stretch" : "flex-start", minWidth: 200 }}>
            <div style={{ border: "solid 2px white", padding: 20, margin: 20, width: window.innerWidth < 1450 ? "initial" : "22.5%" }}>
              <div className="row center x-center">
                <h5 style={{position: "relative", top: -32, backgroundColor: "#333", padding: "0 10px", display: "inline-block"}}>Add Modules</h5>
              </div>
              {
                this.modulePanels()
              }
            </div>
            <div className="col x-center edit-modules" style={{ margin: 20, padding: "30px 20px", border: "solid 2px white", width: window.innerWidth < 1450 ? "initial" : "65%" }}>
              <div className="row center x-center">
                <h5 style={{position: "relative", top: -42, backgroundColor: "#333", padding: "0 10px", display: "inline-block"}}>Edit Modules</h5>
              </div>
              {
                this.accordionItems().map(function(item, index){
                  return (
                    <AccordionContainer title={item.title} open={self.state.active === index}
                    handler={ () =>
                      {
                        self.setState({ active: (index !== self.state.active ? index : -1) })
                      } }
                    >
                      { item.content }
                    </AccordionContainer>
                  )
                })
              }
            </div>
            <div style={{padding: 22, margin: 20, width: "22.5%", minWidth: 200}}>
            </div>
          </div>
          {
            this.buttons()
          }
        </div>
      </div>
    )
  }
}
