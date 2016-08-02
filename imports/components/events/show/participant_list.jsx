import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class ParticipantListPanel extends Component {

  constructor(props) {
    super(props);
  }

  imgOrDefault(imgID) {
    if(imgID){
      var img = ProfileImages.findOne(imgID);
      if(img){
        return img.url();
      }
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

  toggleRegistration(id) {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.toggle_participation", this.props.id, id, function(err) {
        if(err){
          toastr.error(err.reason, "Error!");
        }
      });
    }
  }

  isEliminated(userID) {
    var matchID = null;
    var currentRound = 0;
    for(var i = 0; i < this.props.rounds[0].length; i ++){
      var match = this.props.rounds[0][i];
      if(userID == match.playerOne || userID == match.playerTwo){
        matchID = i;
        break;
      }
    }
    if(matchID == null){
      currentRound = 1;
      for(var i = 0; i < this.props.rounds[1].length; i ++){
        var match = this.props.rounds[1][i];
        if(userID == match.playerOne || userID == match.playerTwo){
          matchID = i;
          break;
        }
      }
    }
    var match = this.props.rounds[currentRound][matchID];
    while(currentRound < this.props.rounds.length && match.winner != null){
      if(match.winner != userID){
        return true;
      }
      currentRound += 1;
      if(currentRound == this.props.rounds.length) {
        break;
      }
      match = this.props.rounds[currentRound][Math.floor(matchID / 2)];
    }
    return false;
  }

  render() {
    return (
      <div className="participant-panel-container">
        {
          (this.props.participants).map((id, i) => {
            var participant = Meteor.users.findOne(id);
            var isElim = this.isEliminated(id);
            return (
              <div className="participant-panel" style={{opacity: isElim ? (0.3) : (1)}}>
                <div className="participant-panel-image">
                  <div className="participant-panel-overlay">
                    <div className="row x-center">
                      <span className="col-1">{i + 1}{this.numberDecorator(i+1)} Seed</span>
                      {
                        isElim ? "" : (
                          <div className="row">
                            {
                              this.props.isOwner ? (
                                <FontAwesome name="cog" size="2x" style={{marginRight: 10}} />
                              ) : (
                                ""
                              )
                            }
                            {
                              (participant._id == Meteor.userId() || this.props.isOwner) ? (
                                <FontAwesome name="minus" size="2x" onClick={this.toggleRegistration(participant._id).bind(this)} />
                              ) : (
                                ""
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <img src={this.imgOrDefault(participant.profile.image)} />
                </div>
                <div className="participant-panel-desc">
                  {
                    participant.username
                  }
                </div>

              </div>
            )
          })
        }
        {
          this.props.participants.includes(Meteor.userId()) ? (
            ""
          ) : (
            <div className="participant-panel" onClick={this.toggleRegistration(Meteor.userId()).bind(this)}>
              <div className="participant-panel-image">
                <FontAwesome name="plus" size="5x" />
              </div>
              <div className="participant-panel-desc">
                Register
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
