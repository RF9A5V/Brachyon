import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import TrackerReact from "meteor/ultimatejs:tracker-react";

import Loading from "/imports/components/public/loading.jsx";
import BlockContainer from "/imports/components/events/discover/block_container.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class UserEvents extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      category: 0,
      page: 0
    }
  }

  events() {
    return Events.find({}).fetch();
  }

  selectEvent(event) {
    return(
      function(e){
        e.preventDefault();
        if(event.published || event.underReview || event.active || event.isComplete){
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

  onSectionClick(category, index, subscription) {
    this.props.onAction(subscription, 0);
    this.setState({
      category,
      index,
      page: 0,
      subscription
    })
  }

  onLoadMore() {
    this.props.onAction(this.state.subscription, this.state.page + 1);
    this.setState({
      page: this.state.page + 1
    });
  }

  onLoadPrev() {
    this.props.onAction(this.state.subscription, this.state.page - 1);
    this.setState({
      page: this.state.page - 1
    })
  }

  sections() {

    var overall = {
      title: "",
      sections: [
        {
          name: "All Events",
          subscription: "organizer.unpublishedEvents"
        },
      ]
    }

    var organizer = {
      title: "Organizer",
      sections: [
        {
          name: "Unpublished",
          subscription: "organizer.unpublishedEvents"
        },
        {
          name: "Awaiting Approval",
          subscription: "organizer.eventsUnderReview"
        },
        {
          name: "Published",
          subscription: "organizer.publishedEvents"
        },
        {
          name: "Past Events",
          subscription: "organizer.completedEvents"
        }
      ]
    }

    var player = {
      title: "Player",
      sections: [
        {
          name: "Upcoming",
          subscription: "player.upcomingEvents"
        },
        {
          name: "Ongoing",
          subscription: "player.ongoingEvents"
        },
        {
          name: "Past",
          subscription: "player.pastEvents"
        }
      ]
    }

    var sponsor = {
      title: "Sponsor",
      sections: [
        {
          name: "Upcoming",
          subscription: "sponsor.upcomingEvents"
        },
        {
          name: "Ongoing",
          subscription: "sponsor.ongoingEvents"
        },
        {
          name: "Past",
          subscription: "sponsor.completedEvents"
        }
      ]
    }

    var spectator = {
      title: "Spectator",
      sections: [
        {
          name: "Upcoming",
          subscription: "spectator.upcomingEvents"
        },
        {
          name: "Ongoing",
          subscription: "spectator.ongoingEvents"
        },
        {
          name: "Past",
          subscription: "spectator.completedEvents"
        }
      ]
    }

    var cats = [overall, organizer, player, sponsor, spectator];
    var rez = [];
    cats.forEach((cat, i) => {
      rez.push(<div className="row" style={{paddingLeft: 10}}><h3>{cat.title}</h3></div>);
      cat.sections.forEach((section, j) => {
        rez.push(
          <div className={`sub-section-select ${this.state.category == i && this.state.index == j ? "active" : ""}`} onClick={() => { this.onSectionClick(i, j, section.subscription) }}>
            { section.name }
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

  eventResults() {
    if(!this.props.isReady) {
      return <Loading/>
    }
    var events = this.events();
    return (
      <div className="col-1 col submodule-section">
        <div className="col-1 row" style={{flexWrap: "wrap"}}>
          {
            events.length > 0 ? (
              <BlockContainer events={events} />
            ) : (
              ""
            )
          }
          {
            events.length == 0 ? (
              this.state.category == 1 ? (
                <div className="row center col-1" style={{padding: "100px 0"}}>
                  <h5>Looks like you don't have any events. Click <Link to={"/events/create"}>here</Link> to create one!</h5>
                </div>
              ) : (
                <div className="row center col-1" style={{padding: "100px 0"}}>
                  <h5>Looks like you don't have any events. Click <Link to={"/events/discover"}>here</Link> to find one!</h5>
                </div>
              )
            ) : (
              ""
            )
          }
          {
            this.state.category != 0 ? (
              <div className="row center x-center">
                {
                  this.state.page == 0 ? (
                    ""
                  ) : (
                    <button onClick={this.onLoadPrev.bind(this)} style={{marginRight: events.length < 6 ? 0 : 10}}>Load Previous</button>
                  )
                }
                {
                  events.length < 6 ? (
                    ""
                  ) : (
                    <button onClick={this.onLoadMore.bind(this)}>Load Next</button>
                  )
                }
              </div>
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="row" style={{alignItems: "flex-start", width: "100%"}}>
        <div className="col" style={{marginRight: 20}}>
          <div className="submodule-section">
            { this.sections() }
          </div>
        </div>
        {
          this.eventResults()
        }
      </div>
    )
  }
}
