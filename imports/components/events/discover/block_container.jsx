import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import RerunModal from "/imports/components/events/admin/rerun_modal.jsx";
import CloseModal from "/imports/components/events/admin/close_modal.jsx";

import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import Instances from "/imports/api/event/instance.js";

export default class BlockContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      closeOpen: false,
      subs: []
    }
  }

  componentWillUnmount() {
    this.state.subs.forEach(s => {
      s.stop();
    })
  }

  selectEvent(event) {
    return(
      function(e){
        var id = Meteor.userId();
        e.preventDefault();
        browserHistory.push(`/event/${event.slug}`);
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

  onEditClick(event) {
    browserHistory.push(`/event/${event.slug}/edit`);
  }

  onRefreshClick(event) {
    this.setState({
      open: true,
      id: event._id
    })
  }

  onCloseClick(event) {
    this.setState({
      closeOpen: true,
      id: event._id
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
              var instance = Instances.findOne(event.instances[event.instances.length - 1]) || {};
              var count = (() => {
                var count = 0;
                if(instance.brackets) {
                  instance.brackets.forEach(bracket => {
                    if(bracket.participants) {
                      count += bracket.participants.length;
                    }
                  });
                }
                return count;
              })();
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
                  <div style={{border: "solid 2px #666", position: "relative", maxWidth: "100%"}}>
                    <h2 className="event-block-title">{ event.details.name }</h2>
                    {
                      isOwner ? (
                        <div className="event-block-admin-row">

                          <div className="event-block-admin-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.onEditClick(event);
                          }} >
                            <span>
                            EDIT
                            </span>
                          </div>
                          {
                            !event.league ? (
                              <div className="event-block-admin-button" onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.onRefreshClick(event);
                              }}>
                                <span>
                                  RERUN
                                </span>
                              </div>
                            ) : (
                              ""
                            )
                          }
                          <div className="event-block-admin-button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.onCloseClick(event);
                          }} >
                            <span>
                              CLOSE
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
                    <div className="col col-1">
                      <div className="row flex-pad x-center" style={{marginBottom: 15}}>
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
        <RerunModal {...this.state} onClose={() => { this.setState({ open: false, id: null }) }} onComplete={(sub) => {
          this.state.subs.push(sub);
          browserHistory.push(`/event/${Events.findOne(this.state.id).slug}`);
          this.setState({ open: false, id: null });

        }} />
        <CloseModal open={this.state.closeOpen} onClose={() => { this.setState({ closeOpen: false, id: null }) }} id={this.state.id} />
      </div>
    );
  }
}
