import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import Editor from "/imports/components/public/editor.jsx";
import { browserHistory } from "react-router";

import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class DisplayPromotedEvent extends Component {
  imgOrDefault(event) {
    if(event.details.banner) {
      return Banners.findOne(event.details.banner).link();
    }
    var games = event.games.fetch();
    for(var i in games) {
      if(games[i].banner != null){
        return Banners.findOne(games[i].banner).link();
      }
    }
    return "/images/bg.jpg";
  }

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

  profileImageOrDefault(id) {
    var img = ProfileImages.findOne(id);
    if(!img) {
      return "/images/profile.png";
    }
    return img.link();
  }

  render(){
    if(!this.props.active) {
      return (
        <div></div>
      )
    }

    var event = this.props.event;
    if(!event) {
      return null;
    }

    return (
      <div className="row center col-1" style={{width: "80vw", padding: 10}}>
        <div className="promoted-event-block">
          <div className="event-block" style={{width: "100%", margin: 0}} onClick={this.selectEvent(event).bind(this)} key={event._id}>
            <div style={{border: "solid 2px #666"}}>
              <h2 className="event-block-title">{ event.details.name }</h2>
            </div>
            <div className="event-block-img" style={{backgroundImage: `url(${this.imgOrDefault(event)})`}}>
            </div>
            <div className="event-block-content" style={{position: "relative"}}>
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
        </div>
      </div>
    )
  }
}
