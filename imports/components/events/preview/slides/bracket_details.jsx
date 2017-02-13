import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

class BracketDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }

  status(bracket) {
    var text = "";
    var icon = "circle";
    if(!bracket.id) {
      text = "Registration Open";
      icon = "clock-o";
    }
    else if(!bracket.isComplete) {
      text = "Running";
      icon = "ellipsis-h";
    }
    else {
      text = "Complete";
      icon = "check";
    }
    return (
      <div className="row x-center" style={{marginBottom: 10}}>
        <FontAwesome name={icon} style={{marginRight: 10}} />
        <span>{ text }</span>
      </div>
    )
  }

  bracketType(format) {
    switch(format) {
      case "single_elim": return "Single Elimination"
      case "double_elim": return "Double Elimination"
      case "swiss": return "Swiss"
      case "round_robin": return "Round Robin"
      default: return "Default"
    }
  }

  content(bracket) {
    var tabs = [
      "Participants"
    ];
    if(bracket.id && !bracket.isComplete) {
      tabs.push("Matches");
    }
    if(bracket.id) {
      tabs.push("Leaderboard");
      tabs.push("Bracket");
    }
    return (
      <div className="col col-1" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10}}>
        <div className="row" style={{marginBottom: 10}}>
          {
            tabs.map((t, i) => {
              return (
                <div style={{padding: 10, marginRight: 10, cursor: "pointer", borderBottom: this.state.index == i ? "solid 2px #FF6000" : "none"}} onClick={() => { this.setState({ index: i }) }}>
                  { t }
                </div>
              )
            })
          }
        </div>
        {
          this._content(tabs, bracket)
        }
      </div>
    )
  }

  participants(players) {
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          (players || []).map(p => {
            var user = Meteor.users.findOne(p.id);
            return (
              <div className="row" style={{width: 150, marginRight: 10, marginBottom: 10}}>
                <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: 50, height: 50}} />
                <div className="col-1" style={{padding: 10, backgroundColor: "#666"}}>
                  <span style={{maxWidth: "100%"}}>{ p.alias }</span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  matches(id) {
    var bracket = Brackets.findOne(id);
    var matches = {};
    bracket.rounds.forEach((b, i) => {
      var bracketMatches = [];
      b.forEach((r, j) => {
        var roundMatches = [];
        r.forEach(m => {
          if(m) {
            var match = Matches.findOne(m.id);
            if(match.players[0] && match.players[1] && !match.winner) {
              if(matches[`${i}_${j}`]) {
                matches[`${i}_${j}`].push(match);
              }
              else {
                matches[`${i}_${j}`] = [match];
              }
            }
          }
        });
      });
    });
    return (
      <div className="col">
        {
          Object.keys(matches).map(k => {
            var toRender = matches[k];
            var [bracket, round] = k.split("_").map(i => { return parseInt(i) });
            switch(bracket) {
              case 0: bracket = "Winner's Bracket"; break;
              case 1: bracket = "Loser's Bracket"; break;
              case 2: bracket = "Grand Finals"; break;
              default: break;
            }
            return (
              <div className="col" style={{marginBottom: 20}}>
                <h5 style={{marginBottom: 10}}>{bracket}, Round {round + 1}</h5>
                <div className="row" style={{flexWrap: "wrap"}} >
                  {
                    toRender.map(match => {
                      var [p1, p2] = match.players.map(p => { return Meteor.users.findOne(p.id) })
                      return (
                        <div className="row" style={{width: 350, marginRight: 10, marginBottom: 10}}>
                          <img src={p1 && p1.profile.imageUrl ? p1.profile.imageUrl : "/images/profile.png"} style={{width: 100, height: 100}} />
                          <div className="col center col-1" style={{padding: 10, backgroundColor: "#666"}}>
                            <span style={{alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                            <span style={{alignSelf: "center"}}>VERSUS</span>
                            <span style={{alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                          </div>
                          <img src={p2 && p2.profile.imageUrl ? p2.profile.imageUrl : "/images/profile.png"} style={{width: 100, height: 100}} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  leaderboard(obj) {
    var bracket = Brackets.findOne(obj.id);

  }

  _content(tabs, obj) {
    switch(tabs[this.state.index]) {
      case "Participants": return this.participants(obj.participants);
      case "Leaderboard": return null;
      case "Bracket": return null;
      case "Matches": return this.matches(obj.id);
      default: return null;
    }
  }

  render() {
    if(!this.props.ready) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    var event = Events.findOne();
    var bracketMeta = Instances.findOne().brackets[this.props.index];
    var bracket = Brackets.findOne(bracketMeta.id);
    const game = Games.findOne(bracketMeta.game);
    return (
      <div className="row" style={{padding: 10}}>
        <div className="col col-1 x-center" style={{padding: 30}}>
          <img src={game.bannerUrl} style={{width: "100%", height: "auto", marginBottom: 10}} />
          <div style={{padding: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignSelf: "stretch"}}>
            <h5 style={{marginBottom: 10}}>{ bracketMeta.name || game.name }</h5>
            <div className="row x-center" style={{marginBottom: 10}}>
              <FontAwesome name="sitemap" style={{marginRight: 10}} />
              <span>{ this.bracketType(bracketMeta.format.baseFormat) }</span>
            </div>
            { this.status(bracketMeta) }
            <div className="row center">
              <button onClick={() => {
                if(event.owner == Meteor.userId()) {
                  browserHistory.push(`/event/${event.slug}/bracket/${this.props.index}/admin`)
                }
                else {
                  browserHistory.push(`/event/${event.slug}/bracket/${this.props.index}`);
                }
              }}>
                <span>View</span>
              </button>
            </div>
          </div>
        </div>
        <div className="col col-3" style={{padding: 20, paddingLeft: 10, paddingRight: 60}}>
          { this.content(bracketMeta) }
        </div>
      </div>
    )
  }
}

export default createContainer((props) => {
  const bracket = Instances.findOne().brackets[props.index];
  const bracketSub = Meteor.subscribe("brackets", bracket.id);
  return {
    ready: bracketSub.ready()
  }
}, BracketDetails)
