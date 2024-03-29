import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import LoadingScreen from "/imports/components/public/loading.jsx";
import Editor from "/imports/components/public/editor.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";
import Rewards from "/imports/api/sponsorship/rewards.js";
import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

export default class ApproveEventAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventID: null,
      eventsToApprove: Meteor.subscribe("eventsUnderReview", {
        onReady: () => {
          this.setState({ isEventsReady: true })
        }
      }),
      rewards: Meteor.subscribe("rewardsToReview", {
        onReady: () => {
          this.setState({ isRewardsReady: true })
        }
      }),
      isEventsReady: false,
      isRewardsReady: false
    }
  }

  componentWillUnmount() {
    this.state.eventsToApprove.stop();
    this.state.rewards.stop();
  }

  events() {
    return Events.find({ underReview: true });
  }

  imgOrDefault(event) {
    if(event.details.bannerUrl != null){
      return event.details.bannerUrl;
    }
    return "/images/bg.jpg";
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    return user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  approveEvent() {
    Meteor.call("events.approveEventForPublish", this.state.eventID, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({eventID: null});
        return toastr.success("Successfully approved event for publication!", "Success!");
      }
    })
  }

  rejectEvent() {
    Meteor.call("events.rejectEventForPublish", this.state.eventID, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({eventID: null});
        return toastr.success("Successfully rejected event for publication!", "Success!");
      }
    })
  }

  eventList() {
    return (
      <div className="row x-center" style={{flexWrap: "wrap"}}>
        {
          this.events().map((event, i) => {
            return (
              <div className="event-block col" key={i} onClick={() => { this.setState({ eventID: event._id }) }}>
                <h2 className="event-block-title">{ event.details.name }</h2>
                <img src={this.imgOrDefault(event)} style={{width: "100%", height: "auto"}} />
                <div className="event-block-content">
                  <div className="col">
                    <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                      <div className="row x-center" style={{fontSize: 12}}>
                        <img src={this.profileImageOrDefault(event.owner)} style={{width: 12.5, height: "auto", marginRight: 5}} />{ Meteor.users.findOne(event.owner).username }
                      </div>
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
    );
  }

  eventDisplay() {
    var event = Events.findOne(this.state.eventID);
    var tiers = event.crowdfunding.tiers;
    var rewards = event.crowdfunding.rewards;
    return (
      <div>
        <h3>{ event.details.name }</h3>
        <img src={this.imgOrDefault(event)} style={{width: 400, height: "auto", margin: "20px 0"}} />
        <h5>Description</h5>
        <div dangerouslySetInnerHTML={{__html: event.details.description}}></div>
        <h3 style={{marginBottom: 20}}>Crowdfunding Details</h3>
        {
          tiers.map(tier => {
            return (
              <div>
                <h5>{ tier.name } - ${ (tier.price / 100).toFixed(2) }</h5>
                <span>Limit of { tier.limit }</span>
                <div dangerouslySetInnerHTML={{__html: tier.description}}></div>
                <div className="row x-center" style={{marginBottom: 20}}>
                  {
                    tier.rewards.map(id => {
                      var reward = Rewards.findOne(id);
                      var rewardIcon = RewardIcons.findOne(reward.image);
                      return (
                        <div>
                          <img style={{width: 50, height: 50, marginRight: 10}} src={reward.imgUrl} />
                          <span>{ reward.name }</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
        {
          rewards.map(rewardId => {
            var reward = Rewards.findOne(rewardId);
            return (
              <div>
                <div className="row x-center" style={{marginBottom: 20}}>
                  <img style={{width: 50, height: 50, marginRight: 20}} src={reward.imgUrl} />
                  <h5>{ reward.name }</h5>
                </div>
                <div dangerouslySetInnerHTML={{__html: reward.description}}>
                </div>
              </div>
            )
          })
        }
        <div className="row x-center" style={{position: "fixed", bottom: 60, right: 20}}>
          <button style={{marginRight: 10}} onClick={() => { this.approveEvent() }}>Approve</button>
          <button style={{marginRight: 10}} onClick={() => { this.rejectEvent() }}>Reject</button>
          <button onClick={() => { this.setState({ eventID: null }) }}>Back</button>
        </div>
      </div>
    )
  }

  render() {
    if(!this.state.isEventsReady || !this.state.isRewardsReady) {
      return <LoadingScreen />
    }
    if(this.state.eventID) {
      return this.eventDisplay();
    }
    return this.eventList();
  }
}
