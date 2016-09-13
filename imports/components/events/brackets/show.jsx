import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LeaderboardPanel from "../show/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";
import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import SideTabs from "../../public/side_tabs.jsx";

export default class BracketShowScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      bracket: Meteor.subscribe("bracket", props.params.eventId, props.params.bracketIndex)
    }
  }

  bracket() {
    return Events.find().fetch()[0].brackets[this.props.params.bracketIndex];
  }

  items() {
    var menuItems = [
      "Leaderboard",
      "Participant List",
      "Bracket Display"
    ];
    if(Meteor.userId() == Events.findOne().owner) {
      menuItems.push("Options");
    }
    return menuItems;
  }

  content() {
    var panelItems = [
      <LeaderboardPanel participants={this.bracket().participants || []} />,
      <ParticipantList participants={this.bracket().participants || []} rounds={this.bracket().rounds} bracketIndex={this.props.params.bracketIndex} isOwner={Meteor.userId() == Events.findOne().owner} />,
      <BracketPanel id={Events.findOne()._id} rounds={this.bracket().rounds} format={this.bracket().format.baseFormat}/>
    ];
    if(Meteor.userId() == Events.findOne().owner) {
      panelItems.push(<OptionsPanel bracketIndex={this.props.params.bracketIndex} />);
    }
    return panelItems;
  }

  render() {
    if(!this.state.bracket.ready()) {
      return (
        <div>
          Loading...
        </div>
      );
    }
    return (
      <div>
        <SideTabs items={this.items()} panels={this.content()} />
      </div>
    );
  }
}
