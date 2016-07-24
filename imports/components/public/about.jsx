import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class LandingScreen extends React.Component {

  componentWillMount() {
    var self = this;
    this.setState({
      events: Meteor.subscribe('discoverEvents'),
      index: 0
    })
  }

  promotedEvents() {
    return Events.find({"promotion.active": {$ne: null}}, {sort: {"promotion.bid": -1}, $limit: 5}).fetch();
  }

  render() {
    return(
      <div className="about-layout">
        <div className="side-tab-item-container">
          <div className={`side-tab-item ${index == 0 ? "active" : ""}`}>What Is Brachyon?</div>
          <div className={`side-tab-item ${index == 1 ? "active" : ""}`}>Brachyon Lets You...</div>
          <div className={`side-tab-item ${index == 2 ? "active" : ""}`}>Why?</div>
          <div className={`side-tab-item ${index == 3 ? "active" : ""}`}>What Is Brachyon?</div>
        </div>
        <div className="side-tab-content">
          <div className="side-tab-panel">
            <div className="row center"><h2>What is Brachyon?</h2></div>
            <div className="row center about-what font-stretch-mid">
              We made a website which allows you to find, fund,
              create and promote competitive gaming events.
              <br/>
              Brachyon makes it easy to build passionate communities
              around competitive games.
            </div>
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Brachyon Lets You...</h2></div>
            <div className="row center">
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="search" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  Quickly search events by area, game and time.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="plus" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  Generate competitive events in seconds.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="arrow-up" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  Share and publicize your events.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="usd" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  Make your event a reality with unique crowdfunding options.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
