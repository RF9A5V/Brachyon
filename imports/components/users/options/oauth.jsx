import React, { Component } from "react";

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
          <label>Facebook</label>
          <div>
            <FacebookConnect />
          </div>
        </div>
        <div className="side-tab-panel">
          <label>Stripe</label>
          {
            Meteor.user().profile.isStripeConnected ? (
              "Already connected!"
            ) : (
              <StripeConnect />
            )
          }

        </div>
        <div className="side-tab-panel">
          <label>Twitch</label>
          <div>
            <TwitchConnect />
          </div>
        </div>
        <div className="side-tab-panel">
          <label>Google</label>
        </div>
        <div className="side-tab-panel">
          <label>Twitter</label>
          <div>
            <TwitterConnect />
          </div>
        </div>
      </div>
    );
  }
}
