import React from 'react';
import { render } from 'react-dom';

import LandingScreen from './index/index.js';
import ShowUserScreen from './users/show.js';

export default class App extends React.Component {
  render() {
    rez = "";
    if(Meteor.userId()){
      rez = (<ShowUserScreen />)
    }
    else {
      rez = (<LandingScreen />)
    }
    return rez;
  }
}
