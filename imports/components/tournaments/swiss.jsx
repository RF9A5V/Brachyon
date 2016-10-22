import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import SwissDisplay from './swiss/display.jsx';

export default class TournamentSwissScreen extends TrackerReact(Component) {

  bracket() {
    return Events.find().fetch()[0].brackets[this.props.params.bracketIndex];
  }

  render() {
    return (
      <div className="screen">
        <SwissDisplay id={Events.findOne()._id} rounds={this.bracket().rounds} format={this.bracket().format.baseFormat} />
      </div>
    )
  }
}
