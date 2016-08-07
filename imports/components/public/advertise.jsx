import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class AdvertiseScreen extends TrackerReact(Component) {
  render(){
    return(
      <div className="side-tab-content">
        <div className="side-tab-panel">
          <div className="row center"><h2>Advertise With Brachyon!</h2></div>
          <div className="row center">
            <div className="about-what">
              We can help you get the word out! Whether you need to promote your events or
              you want to publicize your gaming products,  Brachyon offers three unique methods for advertising
            </div>
          </div>
          <div className="row center">
            <div className="col">
              <div className="row"><h3>Promote Your Events</h3></div>
              <div className="row"></div>
            </div>
            <div className="col">
              <div className="row"><h3>Advertise 2</h3></div>
            </div>
            <div className="col">
              <div className="row"><h3>Advertise 3</h3></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
