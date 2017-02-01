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
    bracket = Brackets.findOne();
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
      if(format == "single_elim" || format == "double_elim") {
        var obj = this.getParticipants();
        var content = Object.keys(obj).sort((a, b) => {
          [win1, los1] = a.split("-").map(parseInt);
          [win2, los2] = b.split("-").map(parseInt);
          if(win1 > win2) {
            return -1;
          }
          else if(win2 > win1) {
            return 1;
          }
          else {
            return (los1 > los2 ? -1 : 1);
          }
        }).map((key, i) => {
          var rankers = obj[key];
          var placement = i + 1;
          var suffix = "th";
          switch(placement % 10) {
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
          return (
            <div style={{marginBottom: 20}}>
              <h5>{placement + suffix} Place</h5>
              <span>Score of: { key }</span>
              <div className="row" style={{flexWrap: "wrap"}}>
              {
                rankers.map(r => {
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
        console.log(content);
        return (
          <div>
            { content }
          </div>
        )
      }

      return (
        <div>
          <ol>
          {
            participants.map((player, index) => {
              return (
                <li style={{marginBottom: 10, padding: 20, backgroundColor: "#222"}}>
                  { player.alias || player.name }
                </li>
              )
            })
          }
          </ol>
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
