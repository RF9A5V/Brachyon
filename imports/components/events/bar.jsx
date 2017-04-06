import React, { Component } from "react";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class Bar extends Component {

  status() {
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
        <FontAwesome name={icon} style={{color, marginRight: 10}} />,
        <span style={{color}}>{ text }</span>
      ]
    )
  }

  render() {
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
              { this.status() }
            </div>
            <div className="event-block-admin-button" style={{width: 100}} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              browserHistory.push("/event/" + event.slug + "/brackets")
            }}>
              View Bracket
            </div>
          </div>
        </div>
      </div>
    )
  }
}
