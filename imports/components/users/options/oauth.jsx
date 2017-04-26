import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import FacebookConnect from "../../oauth/connect/facebook.jsx";
import TwitchConnect from "../../oauth/connect/twitch.jsx";
import TwitterConnect from "../../oauth/connect/twitter.jsx";
import GoogleConnect from "../../oauth/connect/google.jsx";

export default class OAuthOptionsPanel extends Component {
  render() {
    return (
      <div className="side-tab-panel" style={{margin:"auto", paddingTop:10}}>
        <h4>Facebook</h4>
        <div className="about-what center">
          <div>
            <FacebookConnect />
          </div>
        </div>
        <h4>Twitch</h4>
        <div className="about-what center">
          <div>
            <TwitchConnect />
          </div>
        </div>
        <h4>Google</h4>
        <div className="about-what center">
          <div>
            <button >
              <FontAwesome style={{marginRight: 10}} name="google-plus" />
              Connect to Google
            </button>
          </div>
        </div>
        <h4>Twitter</h4>
        <div className="about-what center">
          <div>
            <TwitterConnect />
          </div>
        </div>
      </div>
    );
  }
}
