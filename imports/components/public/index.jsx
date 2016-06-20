import React from 'react';
import LogInScreen from './login.jsx';
import Modal from 'react-modal';
import ShowUserScreen from '../users/show.jsx';
import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

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
            <LogInModal />
            <SignUpModal />
          </div>
          <div className="row center">
            <button className = "facebook"><FontAwesome name="facebook" /></button>
            <button className = "google"><FontAwesome name="google-plus" /></button>
          </div>
          <div className="discover-box">
            <Link to="/events/discover" className="discover row center x-center">
              <span className="fa fa-compass fa-2x compass" ></span>
              <span className="discover-text">Discover Competitive Events</span>
            </Link>
          </div>
          <div className="footer-wrap">
            <div className="footer">
              <div className="footer-content">
                HELLO
              </div>
            </div>
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
          <img src="/images/bg.jpg" draggable="false" />
          <div className="img-background-overlay"></div>
        </div>
        {rez}

      </div>
    );

  }
}
