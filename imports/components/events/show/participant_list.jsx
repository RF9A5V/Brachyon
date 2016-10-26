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

  isEliminated(alias) {
    return false;
    var matchID = null;
    var currentRound = 0;
    if(this.props.rounds == null) {
      return false;
    }
    if(this.props.rounds.length == 0 || !Events.findOne().active){
      return false;
    }
    for(var i = 0; i < this.props.rounds[0].length; i ++){
      var match = this.props.rounds[0][i];
      if(alias == match.playerOne.alias || alias == match.alias){
        matchID = i;
        break;
      }
    }
    if(matchID == null){
      currentRound = 1;
      for(var i = 0; i < this.props.rounds[1].length; i ++){
        var match = this.props.rounds[1][i];
        if(alias == match.playerOne || alias == match.playerTwo){
          matchID = i;
          break;
        }
      }
    }
    var match = this.props.rounds[currentRound][matchID];
    while(this.props.rounds[currentRound] != null && match.winner != null){
      if(match.winner != alias){
        return true;
      }
      currentRound += 1;
      if(currentRound == this.props.rounds.length) {
        break;
      }
      matchID = Math.floor(matchID / 2);
      match = this.props.rounds[currentRound][matchID];
    }
    return false;
  }

  render() {
    return (
      <div className="participant-panel-container">
        {
          (this.props.participants).map((obj, i) => {
            var participant = null;
            if(obj.id != null){
              participant = Meteor.users.findOne(obj.id);
            }
            var isElim = this.isEliminated(obj.alias);
            return (
              <div className="participant-panel" style={{opacity: isElim ? (0.3) : (1)}}>
                <div className="participant-panel-image">
                  <div className="participant-panel-overlay">
                    <div className="row x-center">
                      <span style={{backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 5}}>{i + 1}{this.numberDecorator(i+1)} Seed</span>
                      <div className="col-1"></div>
                      {
                        isElim ? "" : (
                          <div className="row">
                            {
                              this.props.isOwner ? (
                                <FontAwesome name="cog" style={{marginRight: 10, backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 5}} />
                              ) : (
                                ""
                              )
                            }
                            {
                              (obj.id == Meteor.userId() || this.props.isOwner) ? (
                                <FontAwesome name="minus" onClick={this.removeParticipant(i).bind(this)}  style={{backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 5}} />
                              ) : (
                                ""
                              )
                            }
                          </div>
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
        {
          // this.props.participants.some((obj) => { return obj.id == Meteor.userId() || Meteor.userId() == null }) ? (
          //   ""
          // ) : (
          //   <div className="participant-panel" onClick={/*this.registerUser.bind(this)*/}>
          //     <div className="participant-panel-image">
          //       <FontAwesome name="plus" size="5x" />
          //     </div>
          //     <div className="participant-panel-desc">
          //       Register
          //     </div>
          //   </div>
          // )
        }
      </div>
    )
  }
}
