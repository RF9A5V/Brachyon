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
        index
      })
    }
  }

  onBracketSave(e) {
    Meteor.call("events.updateOrganizationBracket", Events.findOne()._id, this.state.index, this.refs[this.state.index].values(), (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Updated your bracket.", "Success!");
      }
    });
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
          <div className="row center x-center" style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20, marginBottom: 20, backgroundColor: "#555"}}>
            <FontAwesome name="plus" size="2x" style={{position: "relative", top: 5}} />
          </div>
        </div>
        <div className="side-tab-panel col x-center">
          <div className="row x-center flex-pad" style={{marginBottom: 20, alignSelf: "stretch"}}>
            <label style={{margin: 0}}>{this.state.organize[this.state.index].name}</label>
            <button style={{margin: 0}} onClick={this.onBracketSave.bind(this)}>Save</button>
          </div>
          {
            this.state.organize.map((bracket, index) => {
              return (
                <div style={{width: "75%", display: index == this.state.index ? ("inherit") : ("none")}}>
                  <BracketForm ref={index} {...bracket}/>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
