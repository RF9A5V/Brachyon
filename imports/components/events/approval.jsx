import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Link } from 'react-router';

export default class ApprovalScreen extends TrackerReact(Component) {

  events() {
    return Events.find().fetch();
  }

  componentWillMount() {
    self = this;
    this.setState({
      events: Meteor.subscribe('events_to_review', {
        onReady() {
          self.setState({ loaded: true })
        }
      }),
      loaded: false
    })
  }

  componentWillUnmount() {
    this.state.events.stop();
  }

  approveEvent(id){
    return function(e){
      Meteor.call('events.approve', id, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Approved event.")
        }
      })
    }
  }

  rejectEvent(id) {
    return function(e){
      Meteor.call('events.reject', id, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Rejected event.")
        }
      })
    }
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
    return (
      <div className="screen">
        <div>
          <table className="approval-table">
            <tr>
              <td>Event Title</td>
              <td>Link To Preview</td>
              <td>Approve</td>
              <td>Reject</td>
            </tr>
            {
              this.events().map(function(event){
                return (
                  <tr>
                    <td>{event.title}</td>
                    <td>
                      <Link to={`events/${event._id}/preview`}>
                        Check Preview
                      </Link>
                    </td>
                    <td>
                      <button onClick={self.approveEvent(event._id)}>Approve</button>
                    </td>
                    <td>
                      <button onClick={self.rejectEvent(event._id)}>Reject</button>
                    </td>
                  </tr>
                );
              })
            }
          </table>
        </div>

      </div>
    );
  }
}
