import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';

export default class ShowUserScreen extends TrackerReact(React.Component) {

  componentWillMount() {
    self = this;
    this.setState({
      events: Meteor.subscribe('userEvents', Meteor.userId(), {
        onReady() {
          self.setState({ loaded: true })
        }
      }),
      currentEvent: null,
      loaded: false
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
    return Events.find({published: false, under_review: false}).fetch();
  }

  underReviewEvents() {
    return Events.find({published: false, under_review: true}).fetch();
  }

  publishedEvents() {
    return Events.find({published: true}).fetch();
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

  render() {
    self = this;

    if(!this.state.loaded){
      return (
        <div>
          Loading...
        </div>
      )
    }

    events = this.events();

    return (
      <div className="row screen">
        <div className="col-1 user-details">
          <img className="profile-photo" src="/images/profile.png" />
          <h3>{Meteor.user() == undefined ? "Loading..." : Meteor.user().username}</h3>
          <button onClick={this.createEvent}>Create Event</button>
          <CreditCardForm/>
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
                          <EventBlock {...ev} image={self.image(ev._id)} handler={self.updateDisplay(ev).bind(self)} />
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
