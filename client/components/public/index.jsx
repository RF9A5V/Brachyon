import React from 'react'
import SignUpScreen from './signup.jsx'
import { render } from 'react-dom';

import ShowUserScreen from '../users/show.jsx';

export default class LandingScreen extends React.Component {
  onClick(e) {
    render(<SignUpScreen />, document.getElementById('main-content'));
  }
  render() {
    if(Meteor.user()){
      return (
        <ShowUserScreen />
      )
    }
    else {
      return (
        <div className="landing-screen">
          <div className="img-background">
            <img src="http://lorempixel.com/1280/720/" />
            <div className="img-background-overlay"></div>
          </div>
          <div className="main-content" id="main-content">
            <h1>BRACHYON</h1>
            <h4>Cogito ergo sum, sit amet dolor quis que something or another</h4>
            <div className="row center">
              <button className="sign-up-link" onClick={this.onClick}>Sign Up</button>
            </div>
          </div>
        </div>
      );
    }
  }
}
