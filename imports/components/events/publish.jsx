import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Link } from 'react-router';

export default class PublishEventScreen extends Component {

  constructor() {
    super();
    this.state = {
      errors: {},
      loaded: false
    };
  }

  componentWillMount() {
    self = this;
    this.setState({
      event: Meteor.subscribe('event', this.props.params.eventId, {
        onReady: function(){
          self.findErrors();
        }
      }),
      errors: {}
    });
    this.findErrors();
  }

  event() {
    return Events.find().fetch()[0];
  }

  findErrors() {
    // Todo: validate fields for event.
    event = this.event();
    if(event == null){
      return;
    }

    console.log(event);

    // Incoming wall of text.

    errors = {}

    // Description error checking.
    description = event.description;
    desc_errs = [];

    if(description == null || description.length == 0){
      desc_errs.push("Your event has to have a description.");
    }

    if(desc_errs.length > 0){
      errors['Description'] = desc_errs;
    }

    // Location error checking.

    loc = event.location;
    location_errs = [];

    if(loc == null){
      location_errs.push("Your event must have a location.");
    }

    if(location_errs.length > 0){
      errors['Location'] = location_errs;
    }

    // DateTime error checking.

    time = event.time;
    time_errs = [];
    if(time == null){
      time_errs.push("Your event must have a start date.", "Your event must have an end date.");
    }
    else {
      if(time.eventStart == ""){
        time_errs.push("Your event must have a start date.")
      }
      if(time.eventEnd == ""){
        time_errs.push("Your event must have an end date.");
      }
    }

    if(time_errs.length > 0){
      errors['Time'] = time_errs;
    }

    this.setState({
      errors,
      loaded: true
    })
  }

  hasErrors() {
    return Object.keys(this.state.errors).length > 0;
  }

  errorView() {
    self = this;
    return (
      <div>
        <h3 className="center">*Can't publish your event due to errors.</h3>
        <div className="row wrap">
          {
            Object.keys(this.state.errors).map(function(val){
              return (
                <ul className="error-container">
                  <h3>{val}</h3>
                  {
                    self.state.errors[val].map(function(err){
                      return (
                        <li>{err}</li>
                      );
                    })
                  }
                </ul>
              )
            })
          }
        </div>
        <div className="row center">
          <Link to={`/events/${this.props.params.eventId}/edit`}>
            <button>Edit Event</button>
          </Link>
        </div>
      </div>
    )
  }

  sendForReview(e) {
    Meteor.call('events.send_for_review', this.event()._id, function(err){
      if(err){
        toastr.error("Couldn't send your event in for review.")
      }
      else {
        window.location = '/';
        toastr.success('Event has been sent for review.');
      }
    })
  }

  publishView() {
    return (
      <div>
        <h3 className="center">All good! Review your event or publish it now!</h3>
        <div className="row center">
          <Link to={`/events/${this.props.params.eventId}/preview`}>
            <button>Preview Event</button>
          </Link>
          <Link to={`/events/${this.props.params.eventId}/edit`}>
            <button style={{marginLeft: 10}}>Edit Event</button>
          </Link>
          <button style={{marginLeft: 10}} onClick={this.sendForReview.bind(this)}>Send For Review</button>
        </div>
      </div>
    );
  }

  render() {
    if(!this.state.loaded){
      return (
        <div>
          Loading;
        </div>
      )
    }
    return (
      <div className="content">
        <h2 className="center">Publish Your Event</h2>
        <div>
          {
            this.hasErrors() ? this.errorView() : this.publishView()
          }
        </div>
      </div>
    );
  }
}
