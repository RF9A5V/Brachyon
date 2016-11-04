import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class BlockContainer extends Component {

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          browserHistory.push(`/events/${event.slug}/show`);
        }
        else {
          browserHistory.push(`/events/${event.slug}/edit`);
        }
      }
    )
  }

  imgOrDefault(event) {
    if(event.details.banner) {
      return Images.findOne(event.details.banner).link();
    }
    var games = event.games.fetch();
    for(var i in games) {
      if(games[i].banner != null){
        return Images.findOne(games[i].banner).link();
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

  onPencilClick(event) {
    var url = "";
    if(event.published) {
      url = `/events/${event.slug}/admin`;
    }
    else {
      url = `/events/${event.slug}/edit`;
    }
    browserHistory.push(url);
  }

  render() {
    var self = this;
    return (
      <div className="col col-1">
        <h3 style={{marginBottom: 10}}>{this.props.title || ""}</h3>
        <div className='event-block-container'>
          {
            this.props.events.map((event, i) => {
              return (
                <div className="event-block" onClick={self.selectEvent(event).bind(self)} key={i}>
                  <div style={{border: "solid 2px #666", position: "relative"}}>
                    <h2 className="event-block-title">{ event.details.name }</h2>
                    {
                      Meteor.userId() == event.owner ? (
                        <div className="event-block-edit" style={{position: "absolute", top: 5, right: 5}} onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.onPencilClick(event);
                        }}>
                          <FontAwesome name="pencil" />
                        </div>
                      ) : (
                        ""
                      )
                    }
                  </div>
                  <div className="event-block-img" style={{backgroundImage: `url(${this.imgOrDefault(event)})`}}>
                  </div>
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
