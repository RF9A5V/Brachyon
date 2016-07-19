import React, { Component } from "react";

import LinkToStripe from "../../public/link_to_stripe.jsx";
import FacebookConnect from "../../oauth/connect/facebook.jsx";

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
              <LinkToStripe />
            )
          }

        </div>
        <div className="side-tab-panel">
          <label>Twitch</label>
        </div>
        <div className="side-tab-panel">
          <label>Google</label>
        </div>
        <div className="side-tab-panel">
          <label>Twitter</label>
        </div>
      </div>
    );
  }
}
