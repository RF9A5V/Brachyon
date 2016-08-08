import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import SingleDisplay from './swiss/display.jsx';

export default class TournamentSingleScreen extends TrackerReact(Component) {

  render() {
    return (
      <div className="screen">
        <SwissDisplay />
      </div>
    )
  }
}
