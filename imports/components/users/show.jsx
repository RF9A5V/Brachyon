import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';

export default class ShowUserScreen extends TrackerReact(React.Component, { profiler: true }) {

  componentWillMount() {
    self = this;
    this.setState({
      events: Meteor.subscribe('events', self.props.id),
      currentEvent: null
    });
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  events(){
    return Events.find().fetch();
  }

  createEvent(e) {
    event.preventDefault();
    Meteor.call('events.create');
  }

  updateDisplay(currentEvent){
    return function(e){
      this.setState({currentEvent});
    }
  }

  onLogOut(e){
    e.preventDefault();
    Meteor.logout();
  }

  render() {
    self = this;
    events = this.events();
    console.log(events);
    return (
      <div className="row screen">
        <header>
          <div className='row'>
            <a href="#" onClick={this.onLogOut}>Log Out</a>
          </div>
        </header>
        <div className="col-1 user-details">
          <img className="profile-photo" src="/images/profile.png" />
          <h3>{Meteor.user() == undefined ? "Loading..." : Meteor.user().username}</h3>
          <button onClick={this.createEvent}>Create Event</button>
        </div>
        <div className="col-3 event-details">
          <EventDisplay {...this.state.currentEvent} />
          <div className="event-list">
            {events.map((function(ev){
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
