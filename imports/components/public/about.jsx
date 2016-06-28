import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class LandingScreen extends React.Component {
  render() {
    return(
      <div className="about-layout row">
        <div className="col">
          <div className="col center x-center">
            <h2>What is Brachyon?</h2>
            <div className="about-what">
              <p>We made a website which allows you to find, fund,
              create and promote competitive gaming events.</p>
            </div>
            <div className="about-what">
              <p>Brachyon makes it easy to build passionate communities
              around competitive games.</p>
            </div>
            <h2>Brachyon Lets You...</h2>
          </div>
          <div className="row">
            <div className="col">
              <div className="col center x-center about-blocks">
                <FontAwesome name="search" size="5x" className="about-icons" />
              </div>
              <div className="col center x-center about-desc">
                Quickly search events by area, game and time.
              </div>
            </div>
            <div className="col">
              <div className="col center x-center about-blocks">
                <FontAwesome name="plus" size="5x" className="about-icons" />
              </div>
              <div className="col center x-center about-desc">
                Generate competitive events in seconds.
              </div>
            </div>
            <div className="col">
              <div className="col center x-center about-blocks">
                <FontAwesome name="arrow-up" size="5x" className="about-icons" />
              </div>
              <div className="col center x-center about-desc">
                Share and publicize your events.
              </div>
            </div>
            <div className="col">
              <div className="col center x-center about-blocks">
                <FontAwesome name="usd" size="5x" className="about-icons" />
              </div>
              <div className="col center x-center about-desc">
                Unique crowdfunding options to make your event a reality.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
