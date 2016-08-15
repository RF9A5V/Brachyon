import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";

import BracketForm from "../brackets/form.jsx";

import Games from "/imports/api/games/games.js";

export default class OrganizationPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      organize: Events.findOne().organize
    }
  }

  componentWillReceiveProps(next) {
    this.setState({
      organize: Events.findOne().organize
    })
  }

  bracketSelectBorder(index){
    if(this.state.index == index) {
      return "solid 2px #1FCB2A"
    }
    else {
      return "none";
    }
  }

  setIndex(index) {
    return (e) => {
      this.setState({
        index,
        create: false
      })
    }
  }

  onBracketSave(e) {
    if(this.state.create) {
      Meteor.call("events.addOrganizationBracket", Events.findOne()._id, this.refs.create.values(), function(err) {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Added bracket.", "Success!");
        }
      });
    }
    else {
      Meteor.call("events.updateOrganizationBracket", Events.findOne()._id, this.state.index, this.refs[this.state.index].values(), (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Updated your bracket.", "Success!");
        }
      });
    }
  }

  onBracketDelete(e) {
    e.preventDefault();
    if(this.state.index < 0 || this.state.create) {
      return;
    }
    Meteor.call("events.deleteOrganizationBracket", Events.findOne()._id, this.state.index, function(err) {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted bracket.", "Success!");
      }
    })
  }

  setCreateMode(e) {
    e.preventDefault();
    this.setState({
      index: -1,
      create: true
    })
  }

  componentWillReceiveProps(next) {
    var organize = Events.findOne().organize;
    this.setState({
      index: organize.length - 1,
      organize: organize
    })
  }

  render() {
    return (
      <div className="col x-center">
        <div className="row" style={{width: "calc(50% + 80px)"}}>
          {
            this.state.organize.map((bracket, index) => {
              return (
                <img style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20, marginBottom: 20, border: this.bracketSelectBorder(index)}} src={Images.findOne(Games.findOne(bracket.game).banner).url()} onClick={this.setIndex.bind(this)(index)} />
              )
            })
          }
          <div className="row center x-center" style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20, marginBottom: 20, backgroundColor: "#555"}} onClick={this.setCreateMode.bind(this)}>
            <FontAwesome name="plus" size="2x" style={{position: "relative", top: 2}} />
          </div>
        </div>
        {
          this.state.organize.length == 0 ? (
            ""
          ) : (
            <div className="side-tab-panel col x-center">
              <div className="row x-center flex-pad" style={{marginBottom: 20, alignSelf: "stretch"}}>
                <h3 style={{margin: 0}}>{this.state.index >= 0 ? this.state.organize[this.state.index].name : "New Bracket"}</h3>
                <div>
                  <button style={{margin: 0}} onClick={this.onBracketDelete.bind(this)}>Delete</button>
                  <button style={{margin: 0, marginLeft: 10}} onClick={this.onBracketSave.bind(this)}>Save</button>
                </div>
              </div>
              {
                this.state.organize.map((bracket, index) => {
                  return (
                    <div style={{width: "85%", display: index == this.state.index && !this.state.create ? ("inherit") : ("none")}}>
                      <BracketForm ref={index} {...bracket}/>
                    </div>
                  )
                })
              }
              {
                this.state.create ? (
                  <div style={{width: "85%", display: "inherit"}}>
                    <BracketForm ref="create"/>
                  </div>
                ) : (
                  ""
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}
