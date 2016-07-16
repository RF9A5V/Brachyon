import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from "react-router"

import Games from '/imports/api/games/games.js';

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';
import ProfileImage from './profile_image.jsx';
import LinkToStripe from '../public/link_to_stripe.jsx';
import BlockContainer from "/imports/components/events/discover/block_container.jsx";

export default class ShowUserScreen extends TrackerReact(React.Component) {

  componentWillMount() {
    self = this;
    this.setState({
      events: Meteor.subscribe('userEvents', Meteor.userId()),
      currentEvent: null
    });
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  events(){
    return [
      {
        title: "Unpublished",
        events: this.unpublishedEvents()
      },
      {
        title: "Under Review",
        events: this.underReviewEvents()
      },
      {
        title: "Published",
        events: this.publishedEvents()
      }
    ];
  }

  unpublishedEvents() {
    return Events.find({published: false, underReview: false}, {sort: { "details.name": 1 }}).fetch();
  }

  underReviewEvents() {
    return Events.find({published: false, underReview: true}, {sort: { "details.name": 1 }}).fetch();
  }

  publishedEvents() {
    return Events.find({published: true}, {sort: { "details.name": 1 }}).fetch();
  }

  image(id) {
    return Images.find({ _id: id }).fetch()[0];
  }

  createEvent(event) {
    event.preventDefault();
    Meteor.call('events.create');
  }

  updateDisplay(currentEvent){
    return function(e){
      this.setState({currentEvent});
    }
  }

  onLogOut(e){
    e.preventDefault();
    Meteor.logout();
  }

  imgUrl(id) {
    var img = Images.findOne(id);
    if(img) {
      return img.url();
    }
    else {
      return "/images/bg.jpg";
    }
  }

  profileBannerURL(id) {
    var banner = ProfileBanners.findOne(Meteor.user().profile.banner);
    if(banner){
      return banner.url();
    }
    return "/images/bg.jpg";
  }

  gameBannerURL(id) {
    return Images.findOne(id).url();
  }

  profileImage() {
    var image = ProfileImages.findOne(Meteor.user().profile.image);
    if(image) {
      return image.url();
    }
    return "/images/profile.png";
  }

  render() {
    var self = this;

    if(!this.state.events.ready()){
      return (
        <div>
          Loading...
        </div>
      )
    }

    var events = this.events();

    return (
      <div>
        <div className="user-banner" style={{backgroundImage: `url(${this.profileBannerURL()})`}}>
          <div className="user-img-line row flex-pad x-center">
            <div className="row col-1">
              {
                Meteor.user().profile.games.slice(0, 3).map((game) => {
                  var g = Games.findOne(game);
                  return (
                    <div className="user-game-icon" style={{backgroundImage: `url(${Images.findOne(g.banner).url()})`}}>

                    </div>
                  );
                })
              }
            </div>
            <div className="user-profile-image" style={{backgroundImage: `url(${this.profileImage()})`}}>
            </div>
          </div>
        </div>
        <div className="user-events-container">
          <div className="event-block-container">
            {
              events.map((eventSet) => {
                if(eventSet.events.length === 0) {
                  return (
                    <div></div>
                  );
                }
                return (
                  <div>
                    <h3>{eventSet.title}</h3>
                    <BlockContainer events={eventSet.events} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="row center">
          <button onClick={() => { browserHistory.push("/events/create") }}>Create an Event</button>
        </div>
      </div>
    )

  }
}
