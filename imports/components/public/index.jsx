import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";
import Loader from "/imports/components/public/loader.jsx";

export default class LandingScreen extends ResponsiveComponent {

  constructor() {
    super();
    this.state = {
      open: false
    }
  }

  renderBase(opts) {
    return (
      <div className="landing-screen">
        <div className="img-background"></div>
        <div className="main-content" id="main-content">
          <div className="row center x-center" style={{marginBottom: opts.buttonPadding}}>
            <Loader width={opts.imgDim} animate={false} />
          </div>
          <div className="col" style={{width: opts.btnContainerSize}}>
            <div className="row x-center center" style={{marginBottom: `calc(${opts.btnContainerSize} / 20)`}}>
              <button className="col-1" style={{marginRight: "5%", padding: opts.buttonPadding, fontSize: opts.fontSize, marginBottom: 0}} onClick={() => {
                this.setState({
                  open: true,
                  content: "login"
                })
              }}>
                Log In
              </button>
              <button className="col-1 signup-button" style={{padding: opts.buttonPadding, fontSize: opts.fontSize, borderColor: "#FF6000", marginBottom: 0}} onClick={() => {
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
            <Link to="/discover" className="discover row center x-center" style={{width: "100%", padding: `calc(${opts.buttonPadding} / ${opts.mobile ? 1 : 2})`, marginTop: 0}}>
              <span className="fa fa-compass compass" style={{fontSize: opts.fontSize}}></span>
              <span className="discover-text" style={{fontSize: opts.fontSize}}>Discover Competitive Events</span>
            </Link>
          </div>
        </div>
        <div className="row x-center footer-buttons" style={{backgroundColor: "rgba(0,0,0,0.5"}}>
          <div className={`create-container-option col-1 orange title footer-bar ${opts.mobile ? "mobile" : "desktop"}`} style={{fontSize: opts.fontSize}}>
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
      imgDim: 400,
      fontSize: "2.5em",
      btnContainerSize: "60vw",
      buttonPadding: "2rem",
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      imgDim: 200,
      fontSize: "1em",
      btnContainerSize: "300px",
      buttonPadding: 10,
      mobile: false
    });
  }
}
