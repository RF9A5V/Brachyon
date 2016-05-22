import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class LoadingScreen extends TrackerReact(React.Component) {
  render() {
    return (
      <div className="loading-screen">
        <img src="/images/balls.svg" />
      </div>
    )
  }
}
