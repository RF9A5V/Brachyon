import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

export default class BlockContainer extends Component {

  selectEvent(eventID) {
    return(
      function(e){
        e.preventDefault();
        const path = `/events/${eventID}/preview`
        console.log(path)
        browserHistory.push(path)
      }
    )
  }

  imgOrDefault(event) {
    var img = Images.findOne(event.details.banner);
    if(img){
      return img.url();
    }
    return "/images/bg.jpg";
  }

  render() {
    var self = this;
    return (
      <div className='event-block-container'>
        {
          this.props.events.map(function(event){
            return (
              <div className="event-block" onClick={self.selectEvent(event._id).bind(self)}>
                <img src={self.imgOrDefault(event)} />
                <div className="event-block-details">
                  <h2 className="event-block-title">{ event.details.name }</h2>
                  <div className="event-block-content">
                    <div>
                      {/*Crowdfunding check goes here */}
                      {
                        event.details.location.online ? (
                          <div><FontAwesome name="signal" /> Online Event</div>
                        ) : (
                          <div>
                            <FontAwesome name="map-marker" /> {event.details.location.city}, {event.details.location.state}
                          </div>
                        )
                      }
                    </div>
                    <div className="row">
                      <span><FontAwesome name="user" /> {Meteor.users.findOne(event.owner).username}</span>
                      <div className="col-1"></div>
                      <span><FontAwesome name="calendar" /> {moment(event.details.datetime).format("MMM Do, YYYY")}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
