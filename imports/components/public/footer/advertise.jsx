import React from 'react';

export default class AdvertiseScreen extends React.Component {
  render(){
    return(
      <div className="side-tab-content">
        <div className="side-tab-panel">
          <div className="row center"><h2>Advertise With Brachyon!</h2></div>
          <div className="row center">
            <div className="about-what">
              We can help you get the word out! Whether you need to promote your events or
              you want to publicize your gaming products, Brachyon offers three unique methods for advertising.
            </div>
          </div>
          <div className="row center">
            <div className="col" style={{margin: 5}}>
              <div className="row center"><h3>Discover Promotion and Verification</h3></div>
              <div className="row center">
                Brachyon's tournament organizers bid for front page access. The top 5
                bids are promoted events leading up to the day their event runs.
                Whether your bid makes the top 5 or not, we still bump your event
                to the top of search results, verify your tournament with our logo,
                and will randomly be publicized through our opt-in advertisement for
                currency feature.
              </div>
            </div>
            <div className="col" style={{margin: 5}}>
              <div className="row center"><h3>Opt-in Advertisement for Currency</h3></div>
              <div className="row center">
                If the phrase "free money" entices you, this feature was built for
                you! Can't pay for your next tournament? We have you covered. Simply
                opt-in to some quick advertisements and feedback questions and, in
                return, you receive money. Advertisers get relevant viewers who
                actively consume the content, users get free money, and everyone wins.
                Advertisers who want to supply the for our system should contact us here.
              </div>
            </div>
            <div className="col" style={{margin: 5}}>
              <div className="row center"><h3>On-Site Event Advertisements</h3></div>
              <div className="row center">
                Are you a company looking to promote your goods and/or services
                at competitive gaming events? We can match you up with the perfect
                event(s) to maximize your benefit and exposure. If you want to set up
                a booth at an event, we can help with that. Alternatively, Brachyon
                allows you to offer deals, discounts and promotions for businesses
                located near events. Contact us here to learn more.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
