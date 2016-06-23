import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import TestTree from './test_tree.jsx';

export default class TestScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;
    this.setState({
      event: Meteor.subscribe('event', 'vGpQ5JCmWrKkaQoYB', {
        onReady() {
          self.setState({
            loaded: true
          })
        }
      }),
      loaded: false
    })
  }

  render() {
    if(!this.state.loaded) {
      return (<div></div>)
    }
    return (<TestTree {...Sponsorships.find().fetch()[0]} />)
  }
}
