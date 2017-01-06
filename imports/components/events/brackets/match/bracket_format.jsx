import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class BracketFormat extends Component {

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

  onMatchUpdateScore(isPlayerOne, value) {
    var id = Brackets.findOne()._id;
    var bracket = this.props.params.bracket - 1;
    var round = this.props.params.round - 1;
    var match = this.props.params.match - 1;
    Meteor.call("events.brackets.updateMatchScore", id, bracket, round, match, isPlayerOne, value, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      this.props.parentUpdate();
    })
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
        Meteor.call("events.advance_match", id, bracket, round, match, index, (err) => {
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

  score(player, isP1) {
    if(Meteor.userId() == Events.findOne().owner) {
      var match = Brackets.findOne().rounds[this.props.params.bracket - 1][this.props.params.round - 1][this.props.params.match - 1];
      return (
        <div className="col x-center">
          {
            !match.winner ? (
              <FontAwesome size="2x" name="caret-up" onClick={() => {
                this.onMatchUpdateScore(isP1, 1)
              }} />
            ) : (
              ""
            )
          }

          <h1 style={{margin: "5px 0"}}>{player.score}</h1>
          {
            !match.winner ? (
              player.score <= 0 ? (
                <FontAwesome size="2x" name="caret-down" style={{color: "#666"}} />
              ) : (
                <FontAwesome size="2x" name="caret-down" onClick={() => {
                  this.onMatchUpdateScore(isP1, -1)
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

  winButton(player, index) {
    var match = Brackets.findOne().rounds[this.props.params.bracket - 1][this.props.params.round - 1][this.props.params.match - 1];
    if(Meteor.userId() == Events.findOne().owner && !match.winner) {
      return (
        <button onClick={this.onMatchUserClick(index)}>Declare Winner</button>
      )
    }
    return (
      <div></div>
    )
  }

  render() {
    var match = Brackets.findOne().rounds[this.props.params.bracket - 1][this.props.params.round - 1][this.props.params.match - 1];
    return (
      <div className="col center x-center">
        <h3 style={{marginBottom: 10}}>{ this.props.p.name }</h3>
        {
          this.props.i == 0 ? (
            <div className="row x-center" style={{marginBottom: 20}}>
              <img src={this.getProfileImage( this.props.p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginRight: 25}} />
              { this.score(this.props.p, this.props.i == 0) }
            </div>
          ) : (
            <div className="row x-center" style={{marginBottom: 20}}>
              { this.score(this.props.p, this.props.i == 0) }
              <img src={this.getProfileImage(this.props.p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginLeft: 25}} />
            </div>
          )
        }
        {
          this.winButton(this.props.p, this.props.i)
        }
        {
          match.winner && match.winner == this.props.p.name ? (
            <span className="row x-center center" style={{color: "#FF6000", fontSize: 16}}>
              <FontAwesome name="star" size="2x" style={{color: "#FF6000", marginRight: 10}} />
              Winner
            </span>
          ) : (
            <div style={{width: 10, height: 32}}></div>
          )
        }
      </div>
    )
  }
}
