import React from 'react';
import LogInScreen from './login.jsx';
import Modal from 'react-modal';
import ShowUserScreen from '../users/show.jsx';
import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

export default class LandingScreen extends React.Component {

  render() {
    return (
      <div className="landing-screen">
        <div className="img-background"></div>
        <div className="main-content" id="main-content">
          <div className="row center">
            <img src="/images/beta_logo.png" style={{width: 150, height: 150}} />
          </div>
          {
            // <h1>BRACHYON</h1>
            // <h3 className="row center">Beyond The Brackets</h3>
          }
          <div className="row x-center center">
            <LogInModal />
            <SignUpModal />
          </div>
          <div className="discover-box">
            <Link to="/discover" className="discover row center x-center">
              <span className="fa fa-compass fa-2x compass" ></span>
              <span className="discover-text">Discover Competitive Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
