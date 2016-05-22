import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Mongo } from 'meteor/mongo';
Events = new Mongo.Collection('events');

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';

export default class ShowUserScreen extends TrackerReact(React.Component) {

  componentWillMount() {
    this.setState({event: null})
  }

  events() {
    // TODO: Replace all call with possessive.
    return Events.find({owner: Meteor.userId()}).fetch();
  }

  currentUser(){
    return Meteor.user();
  }

  createEvent(event) {
    event.preventDefault();
    Events.insert({
      owner: Meteor.userId()
    });
  }

  updateDisplay(event){
    return function(e){
      this.setState({event});
    }
  }

  render() {
    self = this;
    return (
      <div className="row">
        <div className="col-1 user-details">
          <img className="profile-photo" src="http://lorempixel.com/400/400/" />
          <h3>{this.currentUser() == undefined ? "Loading..." : this.currentUser().username}</h3>
          <button onClick={this.createEvent}>Create Event</button>
        </div>
        <div className="col-3 event-details">
          <EventDisplay {...this.state.event} />
          <div className="event-list">
            {this.events().map((function(ev, index){
              return (
                <EventBlock {...ev} key={ev._id} handler={this.updateDisplay(ev).bind(this)} />
              )
            }).bind(this))}
          </div>
        </div>
      </div>
    );
  }
}
