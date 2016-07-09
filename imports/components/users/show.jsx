import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import Games from '/imports/api/games/games.js';

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';
import ProfileImage from './profile_image.jsx';
import BasicExample from '../public/modal.jsx';
import LinkToStripe from '../public/link_to_stripe.jsx';

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

  gameBannerURL(id) {
    return Images.findOne(id).url();
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
      <div className="row">
        <div className="col-1 user-details">
          <ProfileImage imgID={Meteor.user().profile.image} />
          <div style={{alignSelf: 'stretch'}}>
            <h2>Alias</h2>
            <h3>{Meteor.user() == undefined ? "Loading..." : Meteor.user().username}</h3>
            <h2>Games Played</h2>
            <div className="game-icon-container">
              {
                Games.find().fetch().map(function(game){
                  return (
                    <div className="game-icon" style={{
                      backgroundImage: `url(${self.gameBannerURL(game.banner)})`,
                      backgroundSize: '100% 100%'
                    }}>
                    </div>
                  );
                })
              }
              <div className="game-icon add">
                <Link to={`/games/select`}>
                  <FontAwesome name="plus" />
                </Link>
              </div>

            </div>
            <h2>Create an Event</h2>
            <Link to='/events/create'>
              <button>Create Event</button>
            </Link>
            <LinkToStripe />
          </div>
        </div>
        <div className="col-3 event-details">
          <EventDisplay {...this.state.currentEvent} />
          {
            events.map(function(eventSet){
              return (
                <div>
                  <h3>{eventSet.title}</h3>
                  <div className="event-list">
                    {
                      eventSet.events.map(function(ev){
                        return (
                          <EventBlock image={self.imgUrl(ev.details.banner)} handler={self.updateDisplay(ev).bind(self)} />
                        )
                      })
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
