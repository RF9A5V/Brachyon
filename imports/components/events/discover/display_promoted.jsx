import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import Editor from "/imports/components/public/editor.jsx";
import { browserHistory } from "react-router";

import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class DisplayPromotedEvent extends Component {
  imgOrDefault(event) {

    if(event.details.bannerUrl) {
      return event.details.bannerUrl
    }
    return "/images/bg.jpg";
  }

  ownerDetails(event) {
    var imgUrl, name;
    if(event.orgEvent) {
      var org = Organizations.findOne(event.owner);
      imgUrl = org.profileUrl;
      name = org.name;
    }
    else {
      var user = Meteor.users.findOne(event.owner);
      imgUrl = user.profile.imageUrl;
      name = user.username;
    }
    if(!imgUrl) {
      imgUrl = "/images/profile.png";
    }
    return (
      <div className="row x-center" style={{fontSize: 12}}>
        <img src={imgUrl} style={{width: 12.5, height: "auto", marginRight: 5}} />{ name }
      </div>
    )
  }

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          browserHistory.push(`/event/${event.slug}/show`);
        }
        else {
          browserHistory.push(`/event/${event.slug}/edit`);
        }
      }
    )
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
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
      <div className="row center col-1" style={{width: "60vw", padding: 10}}>
        <div className="promoted-event-block">
          <div className="event-block" style={{width: "100%", margin: 0}} onClick={this.selectEvent(event).bind(this)} key={event._id}>
            <div style={{border: "solid 2px #666"}}>
              <h2 className="event-block-title">{ event.details.name }</h2>
            </div>
            <div className="event-block-img" style={{backgroundImage: `url(${this.imgOrDefault(event)})`}}>
            </div>
            <div className="event-block-content" style={{position: "relative"}}>
              <div className="col col-1">
                <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                  <div className="row x-center" style={{fontSize: 12}}>
                    { this.ownerDetails(event) }
                  </div>
                  <span style={{fontSize: 12}}>{
                    (() => {
                      var count = 0;
                      if(event.type==null||event.type=="event"){
                        if(event.brackets) {
                          event.brackets.forEach(bracket => {
                            if(bracket.participants) {
                              count += bracket.participants.length;
                            }
                          });
                        }
                      }
                      else{return;}
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
