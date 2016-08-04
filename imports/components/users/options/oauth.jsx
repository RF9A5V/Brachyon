import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import StripeConnect from "../../oauth/connect/stripe.jsx";
import FacebookConnect from "../../oauth/connect/facebook.jsx";
import TwitchConnect from "../../oauth/connect/twitch.jsx";
import TwitterConnect from "../../oauth/connect/twitter.jsx";
import GoogleConnect from "../../oauth/connect/google.jsx";

export default class OAuthOptionsPanel extends Component {
  render() {
    return (
      <div>
        <div className="side-tab-panel">
          <h3>Facebook</h3>
          <div>
            <FacebookConnect />
          </div>
        </div>
        <div className="side-tab-panel">
          <h3>Stripe</h3>
          {
            Meteor.user().profile.isStripeConnected ? (
              "Already connected!"
            ) : (
              <StripeConnect />
            )
          }

        </div>
        <div className="side-tab-panel">
          <h3>Twitch</h3>
          <div>
            <TwitchConnect />
          </div>
        </div>
        <div className="side-tab-panel">
          <h3>Google</h3>
          <div>
            <button >
              <FontAwesome style={{marginRight: 10}} name="google-plus" />
              Connect to Google
            </button>
          </div>
        </div>
        <div className="side-tab-panel">
          <h3>Twitter</h3>
          <div>
            <TwitterConnect />
          </div>
        </div>
      </div>
    );
  }
}
