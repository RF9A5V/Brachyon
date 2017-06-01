import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import Editor from "/imports/components/public/editor.jsx";
import { browserHistory } from "react-router";

import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DisplayPromotedEvent extends ResponsiveComponent {
  imgOrDefault(event) {

    if(event.details.bannerUrl) {
      return event.details.bannerUrl
    }
    return "/images/bg.jpg";
  }

  ownerDetails(event,opts) {
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
      <div className="row x-center" style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk)}}>
        <img src={imgUrl} style={{width: 12.5, height: "auto", marginRight: 5, marginLeft:opts.mobile?(opts.marginMobile):(opts.marginDesk)}} />{ name }
      </div>
    )
  }

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          browserHistory.push(`/${this.props.event.type}/${event.slug}`);
        }
        else {
          browserHistory.push(`/${this.props.event.type}/${event.slug}`);
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

  renderBase(opts){
    if(!this.props.active) {
      return (
        <div></div>
      )
    }
    var event = this.props.event;
    if(!event) {
      return null;
    }
    var participantCount = (event.type == "instance" || event.type == "event") ? (
      (() => {
        if(event.instances.length == 0) {
          return 0;
        }
        var instId = event.instances[event.instances.length - 1];
        if(!instId) {
          return 0;
        }
        var instance = Instances.findOne(instId) || {};
        var count = 0;
        if(instance.brackets) {
          instance.brackets.forEach(bracket => {
            if(bracket.participants) {
              count += bracket.participants.length;
            }
          });
        }
        return count;
      })()
    ) : (
      (() => {
        var keys = {};
        (event.leaderboard || []).forEach(board => {
          Object.keys(board).forEach(k => {
            keys[k] = 1;
          })
        });
        return Object.keys(keys).length;
      })()
    );
    var action = (val) => {
      return (e) => {
        e.preventDefault();
        e.stopPropagation();
        var type = obj.type;
        if(type == "instance") {
          type = "bracket";
        }
        var identifier = obj.slug || obj._id;
        browserHistory.push("/" + type + "/" + identifier + "/" + val);
      }
    }
    return (
      <div className="row center col-1" style={{width: opts.mobile?(opts.width):(opts.width), padding: 10}}>
        <div className="promoted-event-block">
          <div className={`event-block ${this.props.event.type}`} style={{width: "100%", margin: 0}} onClick={this.selectEvent(event).bind(this)} key={event._id}>
            <div style={{border: "solid 2px #666"}}>
              <h2 className="event-block-title" style={{fontSize:opts.mobile?(20):(30), padding:opts.mobile?(opts.padding):(opts.padding)}}>{ event.details.name }</h2>
              {
                Meteor.userId() == event.owner ? (
                  <div className="event-block-admin-row">
                    <div className="event-block-admin-button col center x-center" onClick={action("edit")}>
                      EDIT
                    </div>
                  </div>
                ) : (
                  ""
                )
              }
            </div>
            <div className="event-block-img" style={{backgroundImage: `url(${this.imgOrDefault(event)})`}}>
            </div>
            <div className="event-block-content" style={{position: "relative", height:opts.mobile?(opts.height):(opts.height)}}>
              <div className="col col-1">
                <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                  <div className="row x-center" style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk)}}>
                    { this.ownerDetails(event, opts) }
                  </div>
                  <span style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk)}}>
                    {participantCount}
                  <FontAwesome name="users" style={{marginLeft: 5, marginRight:opts.mobile?(opts.marginMobile):(opts.marginDesk)}}/></span>
                </div>
                <div className="row flex-pad">
                  {
                    event.details.location.online ? (
                      <div style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk), marginLeft:opts.mobile?(opts.marginMobile):(opts.marginDesk)}}><FontAwesome name="signal" /> Online Event</div>
                    ) : (
                      <div style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk), marginLeft:opts.mobile?(opts.marginMobile):(opts.marginDesk)}}>
                        <FontAwesome name="map-marker" /> {event.details.location.city}, {event.details.location.state}
                      </div>
                    )
                  }
                  <span style={{fontSize:opts.mobile?(opts.fontMobile):(opts.fontDesk)}}>
                    {moment(event.details.datetime).format("MMM Do, YYYY")}
                    <FontAwesome name="calendar" style={{marginLeft: 5, marginRight:opts.mobile?(opts.marginMobile):(opts.marginDesk)}} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  renderMobile() {
    return this.renderBase({
      mobile: true,
      fontMobile: 8,
      marginMobile: -8,
      height:"65px",
      padding:"20px 10px",
      width:"75vw"
    })
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      fontDesk:12,
      marginDesk: 0,
      height:"95px",
      padding:"29px 20px",
      width:"60vw"
    })
  }
}
