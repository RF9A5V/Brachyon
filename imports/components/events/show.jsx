import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SideTabs from "../public/side_tabs.jsx";

export default class ShowEventScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", props.params.eventId)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  items() {
    return ["Leaderboard", "Brackets", "Participant List"];
  }

  content() {
    var event = Events.findOne();
    return [
      (<LeaderboardPanel isDone={event.complete} participants={event.participants} />),
      (<BracketPanel rounds={event.rounds} id={event._id} />),
      (<ParticipantList participants={event.participants} isOwner={event.owner == Meteor.userId()} id={event._id} rounds={event.rounds} />)
    ]
  }

  render(){
    if(!this.state.event.ready()){
      return (
        <div>
        </div>
      )
    }
    return (
      <div>
        <SideTabs items={this.items()} panels={this.content()} />
      </div>
    )
  }
}
