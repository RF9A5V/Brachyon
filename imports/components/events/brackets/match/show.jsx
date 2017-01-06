import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class MatchShowScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", props.params.slug, {
        onReady: () => {
          this.setState({
            bracket: Meteor.subscribe("brackets", Instances.findOne().brackets[props.params.bracketIndex].id, {
              onReady: () => {
                this.setState({
                  isReady: true
                })
              }
            })
          })
        }
      }),
      isReady: false
    }
  }

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
      this.forceUpdate();
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
        Meteor.call("events.advance_match", id, bracket, round, match, index, function(err) {
          if(err){
            toastr.error("Couldn't advance this match.", "Error!");
          }
          else {
            toastr.success("Player advanced to next round!", "Success!");
          }
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
        <h1>{ match.score }</h1>
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
    if(!this.state.isReady) {
      return (
        <div></div>
      )
    }
    var match = Brackets.findOne().rounds[this.props.params.bracket - 1][this.props.params.round - 1][this.props.params.match - 1];
    console.log(match);
    var players = [
      {
        name: match.playerOne,
        score: match.scoreOne
      },
      {
        name: match.playerTwo,
        score: match.scoreTwo
      }
    ];
    var comps = players.map((p, i) => {
      return (
        <div className="col center x-center">
          <h3 style={{marginBottom: 10}}>{ p.name }</h3>
          {
            i == 0 ? (
              <div className="row x-center" style={{marginBottom: 20}}>
                <img src={this.getProfileImage(p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginRight: 25}} />
                { this.score(p, i == 0) }
              </div>
            ) : (
              <div className="row x-center" style={{marginBottom: 20}}>
                { this.score(p, i == 0) }
                <img src={this.getProfileImage(p.name)} style={{width: 100, height: 100, borderRadius: "100%", marginLeft: 25}} />
              </div>
            )
          }
          {
            this.winButton(p, i)
          }
          {
            match.winner && match.winner == p.name ? (
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
    });
    comps.splice(1, 0, (
      <h1>VERSUS</h1>
    ))
    return (
      <div className="row flex-pad x-center" style={{width: "50%", height: "calc(100vh - 110px)", margin: "0 auto"}}>
        <div style={{position: "fixed", left: 20, top: 80}}>
          <button onClick={() => { browserHistory.goBack() }}>
            Back
          </button>
        </div>
        {
          comps
        }
      </div>
    )
  }
}
