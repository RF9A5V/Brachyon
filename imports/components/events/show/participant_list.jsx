import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class ParticipantListPanel extends Component {

  constructor(props) {
    super(props);
  }

  imgOrDefault(userID) {
    var user = Meteor.users.findOne(userID);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  numberDecorator(num) {
    if(num % 10 === 1) {
      return "st";
    }
    else if(num % 2 === 2) {
      return "nd";
    }
    else if(num % 3 === 3) {
      return "rd";
    }
    return "th";
  }

  registerUser(e) {
    e.preventDefault();
    Meteor.call("events.registerUser", Events.findOne()._id, this.props.bracketIndex, function(err) {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully registered for this bracket!", "Success!");
      }
    })
  }

  removeParticipant(index) {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.removeParticipant", Events.findOne()._id, this.props.bracketIndex, index, function(err) {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully removed user from this bracket!", "Success!");
        }
      });
    }
  }

  render() {
    return (
      <div>
        {
          (this.props.participants).map((obj, i) => {
            var participant = null;
            if(obj.id != null){
              participant = Meteor.users.findOne(obj.id);
            }
            return (
              <div className="participant-panel">
                <div className="participant-panel-image">
                  <div className="participant-panel-overlay">
                    <div className="row x-center">
                      <span style={{backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 5}}>{i + 1}{this.numberDecorator(i+1)} Seed</span>
                      <div className="col-1"></div>
                      {
                        Meteor.userId() && (obj.id == Meteor.userId() || this.props.isOwner) ? (
                          <FontAwesome name="minus" onClick={this.removeParticipant(i).bind(this)}  style={{backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 5}} />
                        ) : (
                          ""
                        )
                      }
                    </div>
                  </div>
                  {
                    participant != null ? (
                      <img src={this.imgOrDefault(participant._id)} />
                    ) : (
                      <img src={this.imgOrDefault(null)} />
                    )
                  }
                </div>
                <div className="participant-panel-desc">
                  {
                    obj.alias
                  }
                </div>

              </div>
            )
          })
        }
      </div>
    )
  }
}
