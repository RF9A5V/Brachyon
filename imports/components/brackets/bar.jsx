import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

import { formatter } from "/imports/decorators/formatter.js";

export default class BracketBar extends Component {

  status(bracket) {
    var [icon, color, text] = ["circle", "#FF6000", "Complete"];
    if(!bracket.id) {
      [icon, color, text] = ["circle", "white", "Registration Open"];
    }
    if(bracket.id && !bracket.isComplete) {
      [icon, color, text] = ["circle", "#00BDFF", "Underway"];
    }
    return (
      <div className="row x-center" style={{padding: 5, backgroundColor: "#111"}}>
        <FontAwesome name={icon} style={{color, marginRight: 10}} />
        <span style={{color}}>{ text }</span>
      </div>
    )
  }

  render() {
    var bracket = this.props.bracket;
    var game = Games.findOne(bracket.game);
    var rObj = Brackets.findOne(bracket.id);
    var format;
    var height = 150;
    return (
      <div className="row bracket-bar" onClick={this.props.onBracketSelect}>
        <img src={game.bannerUrl} style={{height, width: height - (height / 4)}} />
        <div className="col col-1" style={{backgroundColor: "#333"}}>
          <div className="col col-1" style={{padding: 10}}>
            <h5 style={{marginBottom: 10}}>{ bracket.name || game.name }</h5>
            <div className="row x-center" style={{marginBottom: 10}}>
              <FontAwesome name="sitemap" style={{marginRight: 10}} />
              <span style={{marginRight: 10}}>{ formatter(bracket.format.baseFormat) }</span>
              <FontAwesome name="users" style={{marginRight: 10}} />
              <span>{ (bracket.participants || []).length }</span>
            </div>
            <div className="col-1"></div>
            <div className="row x-center">
              <div className="event-block-admin-button" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                var event = Events.findOne();
                browserHistory.push("/event/" + event.slug + "/bracket/" + this.props.index + (event.owner == Meteor.userId() ? "/admin" : ""));
              }}>View</div>
            </div>
          </div>
          {
            this.status(bracket)
          }
        </div>
      </div>
    )
  }
}
