import React from 'react';
import LogInScreen from './login.jsx';
import Modal from 'react-modal';
import ShowUserScreen from '../users/show.jsx';

export default class LandingScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      status: 0
    }
  }

  resetState(){
    this.setState({
      status: 0
    });
  }

  render() {
    rez = "";
    if (this.state == null) {
      return (
        <div>
        </div>
      )
    }
    if (this.state.status == 0) {
      rez = (
        <div className="main-content" id="main-content">
          <h1>B R A C H Y O N</h1>
          <h4>Beyond The Brackets</h4>
          <div className="row center">
            <button className="sign-up-link" onClick={(e) => { e.preventDefault(); this.setState({status: 1}) }}>Sign Up</button>
          </div>
        </div>
      );
    }
    else if(this.state.status == 1){
      rez = (
        <div className="main-content" id="main-content">

        </div>
      );
    }
    else {
      rez = (
        <div className="main-content" id="main-content">
          <LogInScreen afterSubmit={this.resetState.bind(this)} />
        </div>
      )
    }
    return (
      <div className="landing-screen screen" style={{position: 'relative'}}>
        <div className="img-background">
          <img src="http://lorempixel.com/1280/720/" />
          <div className="img-background-overlay"></div>
        </div>
        {rez}
      </div>
    );

  }
}
