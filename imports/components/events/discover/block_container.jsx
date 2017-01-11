import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import Instances from "/imports/api/event/instance.js";

export default class BlockContainer extends Component {

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          browserHistory.push(`/event/${event.slug}`);
        }
        else {
          browserHistory.push(`/event/${event.slug}/edit`);
        }
      }
    )
  }

  imgOrDefault(event) {
    return event.details.bannerUrl ? event.details.bannerUrl : "/images/bg.jpg";
  }

  ownerDetails(event) {
    var imgUrl, name;
    if(event.orgEvent) {
      var org = Organizations.findOne(event.owner);
      imgUrl = org.details.profileUrl;
      name = org.name;
    }
    else {
      var user = Meteor.users.findOne(event.owner);
      imgUrl = user.profile.imageUrl;
      name = user.username;
    }
    if(imgUrl == null) {
      imgUrl = "/images/profile.png";
    }
    return (
      <div className="row x-center" style={{fontSize: 12}}>
        <img src={imgUrl} style={{width: 12.5, height: "auto", marginRight: 5}} />{ name }
      </div>
    )
  }

  onPencilClick(event) {
    var url = "";
    if(event.published) {
      url = `/event/${event.slug}/admin`;
    }
    else {
      url = `/event/${event.slug}/edit`;
    }
    browserHistory.push(url);
  }

  onRefreshClick(event) {
    Meteor.call("events.reinstantiate", event._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Event is now set up to rerun!", "Success!");
      }
    })
  }

  render() {
    return (
      <div className="col col-1">
        <h3 style={{marginBottom: 10}}>{this.props.title || ""}</h3>
        <div className='event-block-container'>
          {
            (this.props.events || []).map((event, i) => {
              var e = Events.findOne(event._id);
              var count = 0;
              if(!e) {
                count = event.leaderboard[0].length;
              }
              else {
                var instance = Instances.findOne(event.instances.pop());
                count = (() => {
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
              }
              var instance = Instances.findOne();
              var isOwner = false;
              if(event.orgEvent) {
                var org = Organizations.findOne(event.owner);
                isOwner = org.owner == Meteor.userId() || org.roles.owners.indexOf(Meteor.userId) >= 0;
              }
              else {
                isOwner = Meteor.userId() == event.owner;
              }
              return (
                <div className="event-block" onClick={this.selectEvent(event).bind(this)} key={i}>
                  <div style={{border: "solid 2px #666", position: "relative"}}>
                    <h2 className="event-block-title">{ event.details.name }</h2>
                    {
                      isOwner ? (
                        <div className="event-block-admin-row">
                          {
                            event.isComplete && !event.league ? (
                              <div className="event-block-admin-button" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.onRefreshClick(event);
                              }}>
                                RERUN
                              </div>
                            ) : (
                              ""
                            )
                          }
                          <div className="event-block-admin-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.onPencilClick(event);
                          }} >
                            <span>
                              EDIT
                            </span>
                          </div>
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
                        { this.ownerDetails(event) }
                        <span style={{fontSize: 12}}>{
                          count
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
