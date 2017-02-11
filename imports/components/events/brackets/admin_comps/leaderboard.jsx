import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class LeaderboardPanel extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var participants = [];
    bracket = Brackets.findOne();
    this.state = {
      ready: false,
      inst: instance
    }
  }

  componentWillUnmount(){
    if (this.state.bracket)
      this.state.bracket.stop();
  }

  getParticipants()
  {
    var bracket = Brackets.findOne();
    if(this.state.inst.brackets[this.props.index].format.baseFormat == "round_robin") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
      participants.sort(function(a, b) {
        return b.score - a.score;
      })
    }
    else if(this.state.inst.brackets[this.props.index].format.baseFormat == "swiss") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
    }
    else {
      participants = this.state.inst.brackets[this.props.index].participants;
      var obj = {};
      participants.forEach(p => {
        var totMatches = Matches.find({ "players.alias": p.alias });
        var winMatches = Matches.find({ "winner.alias": p.alias });
        var wins = winMatches.fetch().length;
        var losses = totMatches.fetch().length - wins;
        var keyString = wins + "-" + losses;
        if(obj[keyString] == null) {
          obj[keyString] = [p];
        }
        else {
          obj[keyString].push(p);
        }
      })
      return obj;
    }
    return participants;
  }

  profileImageOrDefault(id) {
    if(id) {
      var user = Meteor.users.findOne(id);
      if(user && user.profile.imageUrl) {
        return user.profile.imageUrl;
      }
    }
    return "/images/profile.png";
  }

  render() {
    var br = Meteor.subscribe("brackets", this.props.id, {
      onReady: () => {
        this.setState({
          bracket: br,
          ready: true
        });
      }
    });

    if (this.state.ready)
    {
      var participants = this.getParticipants();
      var format = this.state.inst.brackets[this.props.index].format.baseFormat;
      var rounds = Brackets.findOne().rounds;
      var placement = [];
      var content;
      if(format == "single_elim") {
        var finals = Matches.findOne(rounds[0].pop()[0].id);
        placement.push([finals.winner]);
        placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]])
        rounds[0].reverse().map(r => {
          var losers = [];
          r.map(m => Matches.findOne((m || {}).id)).forEach(m => {
            if(!m) return;
            losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
          });
          placement.push(losers);
        });
      }
      if(format == "double_elim") {
        var finals = rounds[2].map(m => {return Matches.findOne(m[0].id)});
        finals = finals[1] && finals[1].winner != null ? finals[1] : finals[0];
        placement.push([finals.winner]);
        placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]])
        rounds[1].reverse().forEach(round => {
          var losers = [];
          round.map(m => Matches.findOne((m || {}).id)).forEach(m => {
            if(!m) return;
            losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
          });
          if(losers.length > 0) {
            placement.push(losers);
          }
        });
      }
      var getSuffix = (place) => {
        var suffix = "th";
        switch(place % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
          default:
            break;
        }
        return suffix;
      }
      var currentPlace = 1;
      var content = placement.map((rank, i) => {
        var place = currentPlace;
        var nextPlace = place + rank.length - 1;
        currentPlace += 1 + rank.length - 1;
        return (
          <div style={{marginBottom: 20}}>
            <h5 style={{marginBottom: 10}}>{place + getSuffix(place)} Place {nextPlace != place ? `To ${nextPlace + getSuffix(nextPlace)} Place` : ""}</h5>
            <div className="row" style={{flexWrap: "wrap"}}>
            {
              rank.map(r => {
                return (
                  <div className="row x-center" style={{width: 200, backgroundColor: r.id == Meteor.userId() ? "#FF6000" : "#666", marginRight: 10, marginBottom: 10}}>
                    <img src={this.profileImageOrDefault(r.id)} style={{width: 50, height: 50, marginRight: 10}} />
                    <span>
                      { r.alias }
                    </span>
                  </div>
                )
              })
            }
            </div>
          </div>
        )
      });
      return (
        <div>
          { content }
        </div>
      )
    }
    else
    {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}
