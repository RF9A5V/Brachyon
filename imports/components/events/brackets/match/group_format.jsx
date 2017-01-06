import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class GroupFormat extends Component {
  getProfileImage(id) {
    var participants = Instances.findOne().brackets[0].participants;
    var user = null;
    for(var i in participants) {
      if(participants[i].alias == id) {
        user = Meteor.users.findOne(participants[i].id);
        break;
      }
    }
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  onMatchUpdateScore(fieldToUpdate, multi) {
    var format = Instances.findOne().brackets[this.props.params.bracketIndex].format.baseFormat;
    var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
    var id = Brackets.findOne()._id;
    var round = this.props.params.round - 1;
    var matchIndex = this.props.params.match - 1;
    var score = 3;
    var p1score = Math.max(match.p1score + (fieldToUpdate == "p1" ? 1 * multi : 0), 0);
    var p2score = Math.max(match.p2score + (fieldToUpdate == "p2" ? 1 * multi : 0), 0);
    var ties = Math.max(match.ties + (fieldToUpdate == "ties" ? 1 * multi : 0), 0);
    Meteor.call(format == "swiss" ? "events.update_match" : "events.update_roundmatch", id, round, matchIndex, score, p1score, p2score, ties, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      this.props.parentUpdate();
    })
  }

  score(player, index) {
    if(Meteor.userId() == Events.findOne().owner) {
      var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
      return (
        <div className="col x-center">
          {
            !match.played ? (
              <FontAwesome size="2x" name="caret-up" onClick={() => {
                this.onMatchUpdateScore("p" + index, 1)
              }} />
            ) : (
              ""
            )
          }

          <h1 style={{margin: "5px 0"}}>{player.score}</h1>
          {
            !match.played ? (
              player.score <= 0 ? (
                <FontAwesome size="2x" name="caret-down" style={{color: "#666"}} />
              ) : (
                <FontAwesome size="2x" name="caret-down" onClick={() => {
                  this.onMatchUpdateScore("p" + index, -1)
                }} />
              )
            ) : (
              ""
            )
          }
        </div>
      )
    }
    else {
      return (
        <h1>{ player.score }</h1>
      )
    }
  }

  onMatchUserClick(index) {
    return (e) => {
      e.preventDefault();
      if (index <= 2)
      {
        var id = Brackets.findOne()._id;
        var bracket = this.props.params.bracket - 1;
        var round = this.props.params.round - 1;
        var match = this.props.params.match - 1;
        Meteor.call("events.complete_match", id, round, match, (err) => {
          if(err){
            toastr.error("Couldn't advance this match.", "Error!");
          }
          else {
            toastr.success("Player advanced to next round!", "Success!");
          }
          this.props.parentUpdate();
        })
      }
    }
  }

  winButton(player, index) {
    var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
    if(Meteor.userId() == Events.findOne().owner && !match.played) {
      return (
        <button onClick={this.onMatchUserClick(index)}>Declare Winner</button>
      )
    }
    return (
      <div></div>
    )
  }

  render() {
    var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
    return (
      <div className="col center x-center">
        <h3 style={{marginBottom: 10}}>{ this.props.p.name }</h3>
        {
          this.props.i == 0 ? (
            <div className="row x-center" style={{marginBottom: 20}}>
              <img src={this.getProfileImage( this.props.p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginRight: 25}} />
              { this.score(this.props.p, this.props.i + 1) }
            </div>
          ) : (
            <div className="row x-center" style={{marginBottom: 20}}>
              { this.score(this.props.p, this.props.i + 1) }
              <img src={this.getProfileImage(this.props.p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginLeft: 25}} />
            </div>
          )
        }
        {
          this.winButton(this.props.p, this.props.i)
        }
      </div>
    )
  }
}
