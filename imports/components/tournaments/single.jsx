import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import SingleDisplay from './single/display.jsx';

export default class TournamentSingleScreen extends TrackerReact(Component) {

  render() {
    return (
      <div className="screen">
        <SingleDisplay />
      </div>
    )
  }
}
