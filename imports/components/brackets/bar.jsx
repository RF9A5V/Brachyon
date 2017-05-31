import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import { formatter } from "/imports/decorators/formatter.js";

export default class BracketBar extends ResponsiveComponent {

  status(bracket, opts) {
    var [icon, color, text] = ["circle", "#FF6000", "Complete"];
    if(!bracket.id) {
      [icon, color, text] = ["circle", "white", "Registration Open"];
    }
    if(bracket.id && !bracket.isComplete) {
      [icon, color, text] = ["circle", "#00BDFF", "Underway"];
    }
    return (
      <div className="row flex-pad" style={{padding: 5, backgroundColor: "#111"}}>
        <div className="row x-center">
          <FontAwesome name={icon} style={{color, marginRight: 10}} />
          <span style={{color}}>{ text }</span>
        </div>
        {
          opts.useShort ? (
            null
          ) : (
            <div className="event-block-admin-button" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              var event = Events.findOne();
              browserHistory.push(`/bracket/${bracket.slug}/${event.owner == Meteor.userId() ? "admin" : ""}`);
            }}>
              View
            </div>
          )
        }
      </div>
    )
  }

  renderBase(opts) {
    var bracket = this.props.bracket;
    var game = Games.findOne(bracket.game);
    var rObj = Brackets.findOne(bracket.id);
    var format;
    return (
      <div className="row bracket-bar" onClick={this.props.onBracketSelect} style={{fontSize: opts.fontSize}}>
        <img src={game.bannerUrl} style={{height: opts.imgHeight, width: `calc(3 * ${opts.imgHeight} / 4)`}} />
        <div className="col col-1" style={{backgroundColor: "#333"}}>
          <div className="col col-1" style={{padding: 10}}>
            <h5 style={{marginBottom: 10, fontSize: opts.fontSize}}>{ bracket.name || game.name }</h5>
            {
              bracket.name ? (
                <span>Playing: {game.name}</span>
              ) : ( "" )
            }
            <div className="row x-center">
              <div className="col col-1">
                <div className="row x-center" style={{marginBottom: 10}}>
                  <FontAwesome name="sitemap" style={{marginRight: 10}} />
                  <span>{ formatter(bracket.format.baseFormat, opts.useShort) }</span>
                </div>
                <div className="row x-center" style={{marginBottom: 10}}>
                  <FontAwesome name="users" style={{marginRight: 10}} />
                  <span>{ (bracket.participants || []).length }</span>
                </div>
              </div>
              {
                opts.useShort ? (
                  <button style={{fontSize: opts.fontSize}}>
                    View
                  </button>
                ) : (
                  null
                )
              }
            </div>
          </div>
          {
            this.status(bracket, opts)
          }
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      imgHeight: "150px",
      useShort: false
    });
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      fontSize: "4rem",
      imgHeight: "300px",
      useShort: true
    });
  }

}
