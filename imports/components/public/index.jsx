import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";

export default class LandingScreen extends ResponsiveComponent {

  constructor() {
    super();
    this.state = {
      open: false
    }
  }

  renderBase(ops) {
    return (
      <div className="landing-screen">
        <div className="img-background"></div>
        <div className="main-content" id="main-content">
          <div className="row center x-center" style={{marginBottom: ops.buttonPadding}}>
            <img src="/images/brachyon_logo_trans.png" style={{width: ops.imgDim, height: "auto"}} />
          </div>
          <div className="col" style={{width: ops.btnContainerSize}}>
            <div className="row x-center center" style={{marginBottom: `calc(${ops.btnContainerSize} / 20)`}}>
              <button className="col-1" style={{marginRight: "5%", padding: ops.buttonPadding, fontSize: ops.fontSize, marginBottom: 0}} onClick={() => {
                this.setState({
                  open: true,
                  content: "login"
                })
              }}>
                Log In
              </button>
              <button className="col-1" style={{padding: ops.buttonPadding, fontSize: ops.fontSize, borderColor: "#FF6000", marginBottom: 0}} onClick={() => {
                this.setState({
                  open: true,
                  content: "signup"
                })
              }}>
                Sign Up
              </button>
              {
              // <LogInModal />
              // <SignUpModal />
              }
            </div>
            <Link to="/discover" className="discover row center x-center" style={{width: "100%", padding: ops.buttonPadding, marginTop: 0}}>
              <span className="fa fa-compass compass" style={{fontSize: ops.fontSize}}></span>
              <span className="discover-text" style={{fontSize: ops.fontSize}}>Discover Competitive Events</span>
            </Link>
          </div>
        </div>
        <div className="row x-center footer-buttons" style={{backgroundColor: "rgba(0,0,0,0.5"}}>
          <div className="create-container-option col-1 orange title" style={{fontSize: ops.fontSize}}>
            WHAT IS THIS PLACE?
          </div>
        </div>
        <RegModal open={this.state.open} onClose={() => {
          this.setState({
            open: false
          })
        }} content={this.state.content} />
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      imgDim: "40vw",
      fontSize: "2.5em",
      btnContainerSize: "60vw",
      buttonPadding: "2rem"
    });
  }

  renderDesktop() {
    return this.renderBase({
      imgDim: 200,
      fontSize: "1em",
      btnContainerSize: "300px",
      buttonPadding: 10
    });
  }
}
