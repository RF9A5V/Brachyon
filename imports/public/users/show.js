import React from 'react';
import { render } from 'react-dom';

var currentUser = null;

Tracker.autorun(function(){
  currentUser = Meteor.users.findOne({ _id: Meteor.userId() });
  console.log(currentUser);
});

export default class ShowUserScreen extends React.Component {

  getInitialState() {
    return {
      user: Meteor.user()
    }
  }

  render() {
    events = [
      {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }, {
        imageURL: 'http://lorempixel.com/1280/720/',
        title: 'Event'
      }
    ];

    return (
      <div className="row">
        <div className="col-1 user-details">
          <img className="profile-photo" src="http://lorempixel.com/400/400/" />
          <h3>{currentUser}</h3>
        </div>
        <div className="col-3 event-details">
          <div className="event-display">
            <img className="event-display-img" src="http://lorempixel.com/1280/720/" />
            <div className="col event-display-details">
              <h2>Event Name</h2>
              <p>This is the description for the event. It goes on for a little bit, but not sure how to do the whole concatenation thing because that's always been weird for everybody.</p>
              <div className="row center flex-1">
                <button style={{marginRight: '15px'}}>Edit</button>
                <button style={{marginRight: '15px'}}>Preview</button>
                <button>Publish</button>
              </div>
            </div>
          </div>
          <div className="event-list">
            {events.map(function(event, index){
              return (
                <div className="event-block">
                  <img src={event.imageURL} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}
