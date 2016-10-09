import React, { Component } from "react";
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class UserEvents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      category: 0
    }
  }

  events() {
    if(this.state.category == 0) {
      switch(this.state.index) {
        case 0:
          return Events.find({}).fetch();
        default:
          return Events.find({}).fetch();
      }
    }
    else if(this.state.category == 1) {
      switch(this.state.index) {
        case 0:
          return Events.find({ owner: Meteor.userId(), published: false, underReview: false });
        case 1:
          return Events.find({ owner: Meteor.userId(), published: false, underReview: true });
        case 2:
          return Events.find({ owner: Meteor.userId(), published: true });
        default:
          return [];
      }
    }
    return [];
  }

  selectEvent(event) {
    return(
      function(e){
        e.preventDefault();
        if(event.published || event.underReview || event.active){
          if(event.owner == Meteor.userId()){
            browserHistory.push(`/events/${event._id}/admin`);
          }
          else {
            browserHistory.push(`/events/${event._id}/preview`);
          }
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

  sections() {

    var overall = {
      title: "",
      sections: [
        "All Events"
      ]
    }

    var organizer = {
      title: "Organizer",
      sections: [
        "Unpublished",
        "Awaiting Approval",
        "Published",
        "Past Events"
      ]
    }

    var player = {
      title: "Player",
      sections: [
        "Upcoming",
        "Ongoing",
        "Past"
      ]
    }

    var sponsor = {
      title: "Sponsor",
      sections: [
        "Upcoming",
        "Ongoing",
        "Past"
      ]
    }

    var spectator = {
      title: "Spectator",
      sections: [
        "Upcoming",
        "Ongoing",
        "Past"
      ]
    }

    var cats = [overall, organizer, player, sponsor, spectator];
    var rez = [];
    cats.forEach((cat, i) => {
      rez.push(<div className="row" style={{paddingLeft: 10}}><h3>{cat.title}</h3></div>);
      cat.sections.forEach((section, j) => {
        rez.push(
          <div className={`sub-section-select ${this.state.category == i && this.state.index == j ? "active" : ""}`} onClick={() => { this.setState({ category: i, index: j }) }}>
            { section }
          </div>
        );
      });
    });
    return rez;
  }

  profileImageOrDefault(id) {
    var img = ProfileImages.findOne(id);
    if(!img) {
      return "/images/profile.png";
    }
    return img.link();
  }

  render() {
    return (
      <div className="row" style={{alignItems: "flex-start", width: "100%"}}>
        <div className="col" style={{marginRight: 20}}>
          <div className="submodule-section">
            { this.sections() }
          </div>
        </div>
        <div className="col-1 submodule-section row" style={{flexWrap: "wrap"}}>
          {
            this.events().map((event, i) => {
              return (
                <div className="event-block col" onClick={this.selectEvent(event).bind(self)} key={i}>
                  <h2 className="event-block-title">{ event.details.name }</h2>
                  <img src={this.imgOrDefault(event)} />
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
    )
  }
}
