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
        <div className="img-background-overlay"><div className="img-background"></div></div>
        <div className="main-content" id="main-content">
          <h1>B R A C H Y O N</h1>
          <h4>Beyond The Brackets</h4>
          <div className="row center">
            <LogInModal />
            <SignUpModal />
          </div>
          <div className="row center">
            <button className="fb"><FontAwesome name="facebook" /></button>
            <button className="gplus"><FontAwesome name="google-plus" /></button>
          </div>
          <div className="discover-box">
            <Link to="/events/discover" className="discover row center x-center">
              <span className="fa fa-compass fa-2x compass" ></span>
              <span className="discover-text">Discover Competitive Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
