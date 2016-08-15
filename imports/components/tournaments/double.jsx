import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DoubleDisplay from './double/display.jsx';

export default class TournamentDoubleScreen extends TrackerReact(Component) {

  render() {
    return (
      <div className="screen">
        <DoubleDisplay />
      </div>
    )
  }
}
