import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import SwissDisplay from './swiss/display.jsx';

export default class TournamentSwissScreen extends TrackerReact(Component) {

  bracket() {
    return Events.find().fetch()[0].brackets[this.props.params.bracketIndex];
  }

  bracketById() {
    return Brackets.findOne(this.props.bracketId).rounds;
  }

  render() {
    if(this.props.bracketId) {
      return (
        <div className="screen">
          <SwissDisplay rounds={this.bracketById()} />
        </div>
      )
    }

    return (
      <div className="screen">
        <SwissDisplay id={Events.findOne()._id} rounds={this.bracket().rounds} format={this.bracket().format.baseFormat} />
      </div>
    )
  }
}
