import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class BlockContainer extends Component {

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          browserHistory.push(`/events/${event._id}/preview`);
        }
        else {
          browserHistory.push(`/events/${event._id}/edit`);
        }
      }
    )
  }

  imgOrDefault(event) {
    if(event.bannerUrl != null){
      return event.bannerUrl;
    }
    var games = event.games.fetch();
    for(var i in games) {
      if(games[i].bannerUrl != null){
        return games[i].bannerUrl;
      }
    }
    return "/images/bg.jpg";
  }

  profileImageOrDefault(id) {
    var img = ProfileImages.findOne(id);
    if(!img) {
      return "/images/profile.png";
    }
    return img.link();
  }

  render() {
    var self = this;
    return (
      <div className="col">
        <h3 style={{marginBottom: 10}}>{this.props.title || ""}</h3>
        <div className='event-block-container'>
          {
            this.props.events.map((event, i) => {
              return (
                <div className="event-block col" style={{position: "relative"}} onClick={self.selectEvent(event).bind(self)} key={i}>
                  <h2 className="event-block-title">{ event.details.name }</h2>
                  {
                    Meteor.userId() == event.owner ? (
                      <div className="event-block-edit" style={{position: "absolute", top: 5, right: 5}}>
                        <FontAwesome name="pencil" onClick={() => { alert("hello") }} />
                      </div>
                    ) : (
                      ""
                    )
                  }

                  <img src={self.imgOrDefault(event)} />
                  <div className="event-block-content">
                    <div className="col">
                      <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                        <div className="row x-center" style={{fontSize: 12}}>
                          <img src={this.profileImageOrDefault(Meteor.users.findOne(event.owner).profile.image)} style={{width: 12.5, height: "auto", marginRight: 5}} />{ Meteor.users.findOne(event.owner).username }
                        </div>
                        <span style={{fontSize: 12}}>{
                          (() => {
                            var count = 0;
                            if(event.brackets) {
                              event.brackets.forEach(bracket => {
                                if(bracket.participants) {
                                  count += bracket.participants.length;
                                }
                              });
                            }
                            return count;
                          })()
                        }<FontAwesome name="users" style={{marginLeft: 5}} /></span>
                      </div>
                      <div className="row flex-pad">
                        {
                          event.details.location.online ? (
                            <div style={{fontSize: 12}}><FontAwesome name="signal" /> Online Event</div>
                          ) : (
                            <div style={{fontSize: 12}}>
                              <FontAwesome name="map-marker" /> {event.details.location.city}, {event.details.location.state}
                            </div>
                          )
                        }
                        <span style={{fontSize: 12}}>
                          {moment(event.details.datetime).format("MMM Do, YYYY")}
                          <FontAwesome name="calendar" style={{marginLeft: 5}} />
                        </span>
                      </div>
                    </div>
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
