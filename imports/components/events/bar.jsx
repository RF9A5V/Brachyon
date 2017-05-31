import React, { Component } from "react";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Bar extends ResponsiveComponent {

  status(opts) {
    var event = this.props.event;
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0];
    var [color, icon, text] = ["#FF6000", "circle", "Complete"];
    if(!bracket.id) {
      [color, icon, text] = ["white", "circle", "Starts: " + moment(event.details.datetime).format("MMM Do, h:mmA")];
    }
    else if(!bracket.isComplete) {
      [color, icon, text] = ["#00BDFF", "circle", "Underway"];
    }
    return (
      [
        <FontAwesome name={icon} style={{color, marginRight: 10, fontSize: opts.iconSize}} />,
        <span style={{color, fontSize: opts.fontSize}}>{ text }</span>
      ]
    )
  }

  renderDesktop() {
    var event = this.props.event;
    var bracket = Instances.findOne(event.instances[event.instances.length - 1]).brackets[0];
    return (
      <div className="row event-bar" style={{alignItems: "stretch"}} onClick={() => {
        browserHistory.push("/event/" + event.slug);
      }}>
        <img className="event-bar-img" src={event.details.bannerUrl || "/images/bg.jpg"} />
        <div className="col col-1">
          <div className="col col-1 event-bar-desc" style={{padding: 10}}>
            <div className="row flex-pad" style={{alignItems: "flex-start"}}>
              <div className="col col-1">
                <h2 style={{backgroundColor: "transparent", padding: 0, color: "white", margin: 0}}>{ event.details.name }</h2>
                <div className="row x-center">
                  <FontAwesome name="users" style={{marginRight: 10}} />
                  <span>{ (bracket.participants || []).length }</span>
                </div>
              </div>
              {
                event.owner == Meteor.userId() ? (
                  <div className="event-block-admin-button" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    browserHistory.push("/event/" + event.slug + "/admin")
                  }}>Edit</div>
                ) : (
                  <div></div>
                )
              }

            </div>
          </div>
          <div className="row flex-pad x-center" style={{padding: 10, backgroundColor: "#111"}}>
            <div className="row x-center">
              { this.status({
                fontSize: "1em",
                iconSize: "1em"
              }) }
            </div>
            <div className="event-block-admin-button" style={{width: 100}} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              browserHistory.push(`/bracket/${bracket.slug}/${Meteor.userId() == event.owner ? "admin" : ""}`)
            }}>
              View Bracket
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderMobile() {
    var event = this.props.event;
    var bracket = Instances.findOne(event.instances[event.instances.length - 1]).brackets[0];
    return (
      <div className="row" style={{marginBottom: 10}}>
        <div className="col-1" style={{marginRight: 10, position: "relative"}} onClick={() => {
          browserHistory.push("/event/" + event.slug)
        }}>
          <img src={event.details.bannerUrl || "/images/bg.jpg"} style={{width: "100%", height: "auto"}} />
          <div className="col center x-center" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}>
            <h3 style={{fontSize: "2em", maxWidth: "80%", textOverflow: "ellipsis", overflowX: "hidden"}}>
              {
                event.details.name
              }
            </h3>
            <button style={{fontSize: "1rem"}}>
              View Event
            </button>
          </div>
        </div>
        <div className="col col-1" style={{backgroundColor: "#333", padding: 10}} onClick={() => {
          browserHistory.push("/event/" + event.slug + "/brackets")
        }}>
          <div className="row x-center" style={{marginBottom: 10}}>
            <FontAwesome name="users" style={{fontSize: "1em", marginRight: 10}} />
            <span style={{fontSize: "1em"}}>{ (bracket.participants || []).length }</span>
          </div>
          <div className="row x-center" style={{marginBottom: 10}}>
            { this.status({ iconSize: "1em", fontSize: "1em" }) }
          </div>
          <div className="col col-1 center x-center">
            <button style={{fontSize: "1rem"}}>
              View Bracket
            </button>
          </div>
        </div>
      </div>
    )
  }
}
