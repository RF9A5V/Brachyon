import React, { Component } from "react";

import { browserHistory } from "react-router";

import AccordionContainer from "/imports/components/public/accordion_container.jsx";
import DetailsPanel from "./create/details.jsx";
import RevenuePanel from "./create/module_dropdowns/revenue.jsx";
import OrganizePanel from "./create/module_dropdowns/organize.jsx";
import BotPanel from "./create/module_dropdowns/bot.jsx";
import PromotionPanel from "./create/module_dropdowns/promotion.jsx";
import ModuleBlock from "./create/module_block.jsx";

export default class EventCreateScreen extends Component {

  componentWillMount() {
    var modules = this.availableModules();
    this.setState({
      moduleBits: {
        nonReview: Array(modules.nonReview.length).fill(0),
        review: Array(modules.review.length).fill(0)
      }
    });
  }

  panels() {
    return {
      organization: (<OrganizePanel ref="organize" />),
      // bot: (<BotPanel ref="bot" />),
      promotion: (<PromotionPanel ref="promotion" />),
      revenue: (<RevenuePanel ref="revenue" />)
    }
  }

  availableModules() {
    return {
      nonReview: ["organization"],
      review: ["revenue", "promotion"]
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
    var moduleItems = [
      {
        title: "Details",
        content: (<DetailsPanel ref="details" />)
      }
    ];
    var modules = this.availableModules();
    var keys = Object.keys(modules);
    var panels = this.panels();
    for(var i = 0; i < keys.length; i++){
      for(var j = 0; j < modules[keys[i]].length; j ++){
        if(this.state.moduleBits[keys[i]][j] == 1){
          moduleItems.push({
            title: modules[keys[i]][j][0].toUpperCase() + modules[keys[i]][j].slice(1),
            content: (
              panels[modules[keys[i]][j]]
            )
          })
        }
      }
    }
    return moduleItems;
  }

  submit(e) {
    e.preventDefault();
    var refKeys = Object.keys(this.refs);
    console.log(refKeys);
    var args = {};
    for(var i in refKeys) {
      var key = refKeys[i];
      args[key] = this.refs[key].value();
    }
    console.log(args);
    Meteor.call("events.create", args, function(err, event){
      if(err){
        console.log(err.reason);
      }
      else {
        console.log(event);
        browserHistory.push("/dashboard");
      }
    });
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
          <h3 className="module-block-label">{key == "nonReview" ? ("No Review Required") : ("Review Required")}</h3>
          {
            modules[key].map((value, index) => {
              return (
                <ModuleBlock
                  category={key}
                  modName={value}
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
          <div>
            <h3>Add Modules</h3>
          </div>
          {
            this.modulePanels()
          }
          {
            this.buttons()
          }
        </div>
      </div>
    )
  }
}
