import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Link } from 'react-router';

export default class PublishEventScreen extends Component {

  constructor() {
    super();
    this.state = {
      errors: {}
    };
  }

  componentWillMount() {
    this.setState({
      event: Meteor.subscribe('event', this.props.params.eventId),
      errors: {}
    });
    this.findErrors();
  }

  event() {
    return Event.find().fetch()[0];
  }

  findErrors() {
    // Todo: validate fields for event.
    this.setState({
      errors: {
        Description: ["Description can't be empty."],
        Location: ["Location must exist or be online."],
        Times: ["Event must have times set for start.", "Event must have times set for end."]
      }
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

  publishView() {
    return (
      <div>
        <h3 className="center">All good! Review your event or publish it now!</h3>
        <div className="row center">
          <Link to={`/events/${this.props.params.eventId}/preview`}>
            <button>Preview Event</button>
          </Link>
          <button style={{marginLeft: 10}}>Send For Review</button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
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
