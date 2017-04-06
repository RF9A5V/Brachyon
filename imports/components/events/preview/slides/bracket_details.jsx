import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import UserTab from "/imports/components/users/user_tab.jsx";
import RegisterButton from "/imports/components/events/show/register_button.jsx";

import Games from "/imports/api/games/games.js";
import { getSuffix } from "/imports/decorators/placement_suffix.js";
import { formatter } from "/imports/decorators/formatter.js";

import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";
import LosersBracket from "/imports/components/tournaments/double/losers.jsx";
import BracketPanel from "/imports/components/events/show/bracket.jsx";

class BracketDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      win:true
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
      <div className="row x-center center" style={{marginBottom: 10}}>
        <FontAwesome name={icon} style={{marginRight: 10}} />
        <span>{ text }</span>
      </div>
    )
  }

  content(bracket) {
    var tabs = [
      "Details",
      "Participants"
    ];
    if (bracket.format.baseFormat != "swiss" && bracket.format.baseFormat != "round_robin")
    {
      if(bracket.startedAt != null){
        tabs.push("Bracket");
      }
      if(bracket.id && !bracket.isComplete) {
        tabs.push("Matches");
      }
      if(bracket.id) {
        tabs.push("Leaderboard");
        // tabs.push("Bracket");
      }
    }
    return (
      <div className="col col-1" style={{backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, height: "100%"}}>
        <div className="row" style={{marginBottom: 10}}>
          {
            tabs.map((t, i) => {
              return (
                <div
                  style={{padding: 10, marginRight: 10, cursor: "pointer", borderBottom: this.state.index == i ? "solid 2px #FF6000" : "none", width: 100, textAlign: "center", fontSize: 14}}
                  onClick={() => { this.setState({ index: i }) }}
                >
                  { t }
                </div>
              )
            })
          }
        </div>
        <div className="col-1" style={{overflow: tabs[this.state.index] == "Bracket" ? "hidden" : "auto"}}>
        {
          this._content(tabs, bracket)
        }
        </div>
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
              <UserTab id={p.id} alias={p.alias} />
            );
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
                        <div className="col" style={{margin: "20px 10px 20px 0", width: 350}}>
                          <div className="row match-names">
                            <span>{ match.players[0].alias }</span>
                          </div>
                          <div className="row flex-pad x-center" style={{backgroundColor: "#666"}}>
                            <img src={p1 && p1.profile.imageUrl ? p1.profile.imageUrl : "/images/profile.png"} style={{width: 100, height: 100}} />
                            <div className="col-1 col x-center" style={{padding: 10, backgroundColor: "#666"}}>
                              <span style={{alignSelf: "center"}}>VERSUS</span>
                            </div>
                            <img src={p2 && p2.profile.imageUrl ? p2.profile.imageUrl : "/images/profile.png"} style={{width: 100, height: 100}} />
                          </div>
                          <div className="row match-names justify-end">
                            <span>{ match.players[1].alias }</span>
                          </div>
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
    var losers = [];
    var iterBracket = obj.format.baseFormat == "single_elim" ? bracket.rounds[0] : bracket.rounds[1];
    var stillIn = {};
    obj.participants.forEach(p => {
      stillIn[p.alias] = p.id;
    })
    var placements = [];
    iterBracket.forEach(r => {
      var losers = [];
      r.forEach(m => {
        if(m) {
          var match = Matches.findOne(m.id);
          if(match.winner) {
            var loser = match.winner.alias == match.players[0].alias ? match.players[1] : match.players[0];
            losers.push(loser);
            delete stillIn[loser.alias];
          }
        }
      })
      placements.push(losers);
    });
    if(obj.format.baseFormat == "double_elim") {
      var finals = [bracket.rounds[2][1][0], bracket.rounds[2][0][0]].map(m => { return Matches.findOne(m.id); });
      var match = finals[0].winner ? finals[0] : finals[1];
      if(match.winner) {
        var loser = match.winner.alias == match.players[0].alias ? match.players[1] : match.players[0];
        placements.push([loser]);
        delete stillIn[loser.alias];
      }
    }
    var template = (alias, id) => {
      return (
        <UserTab id={id} alias={alias} />
      );
    }

    var maxPlace = obj.participants.length;
    var remaining = Object.keys(stillIn);
    return (
      <div className="col">

        <h5 style={{marginBottom: 10}}>{ remaining.length > 1 ? "Still In" : "1st Place" }</h5>
        <div className="row" style={{flexWrap: "wrap", marginBottom: 10}}>
          {
            Object.keys(stillIn).map(alias => {
              return template(alias, stillIn[alias]);
            })
          }
        </div>
        {
          placements.map(ary => {
            if(ary.length == 0) {
              return "";
            }
            var upper = maxPlace;
            var lower = maxPlace - ary.length + 1;
            maxPlace -= ary.length;
            return (
              [
                (
                  <h5 style={{marginBottom: 10}}>
                    {getSuffix(lower)} Place{lower == upper ? "" : ` To ${getSuffix(upper)} Place`}
                  </h5>
                ),
                (
                  <div className="row" style={{flexWrap: "wrap", marginBottom: 10}}>
                    {
                      ary.map(p => {
                        return template(p.alias, p.id);
                      })
                    }
                  </div>
                )
              ]
            )
          }).reverse()
        }
      </div>
    )
  }

  _registrationButton(obj) {
    if(!Meteor.userId()) {
      return "";
    }
    return (
      <RegisterButton style={{marginLeft: 10, borderColor: "#FF6000", width: 100}} bracketMeta={obj} metaIndex={this.props.index} />
    );
    // return (
    //   <button style={} onClick={() => {
    //     Meteor.call(func, eventId, this.props.index, Meteor.userId(), (err) => {
    //       if(err) toastr.error(err.reason);
    //       else toastr.success("Success!");
    //     })
    //   }}>
    //     { pIndex >= 0 ? "Unregister" : "Register" }
    //   </button>
    // );
  }

  details(obj) {
    var event = Events.findOne();
    var bracket = Brackets.findOne(obj.id);
    const game = Games.findOne(obj.game);
    return (
      <div className="col col-1 x-center center" style={{padding: 30, height: "100%"}}>
        <img src={game.bannerUrl} style={{width: 300 * 3 / 4, height: 300}} />
        <div style={{padding: 20}}>
          <h5 style={{marginBottom: 10}}>{ obj.name || game.name }</h5>
          <div className="row center x-center" style={{marginBottom: 10}}>
            <FontAwesome name="sitemap" style={{marginRight: 10}} />
            <span>{ formatter(obj.format.baseFormat) }</span>
          </div>
          { this.status(obj) }
          <div className="row center">
            <button style={{width: 100}} onClick={() => {
              if(event.owner == Meteor.userId()) {
                browserHistory.push(`/event/${event.slug}/bracket/${this.props.index}/admin`)
              }
              else {
                browserHistory.push(`/event/${event.slug}/bracket/${this.props.index}`);
              }
            }}>
              <span>View</span>
            </button>
            {
              obj.id ? (
                ""
              ) : (
                this._registrationButton(obj)
              )

            }
          </div>
        </div>
      </div>
    )
  }

  chooseBracket(obj){
    var bracket = Brackets.findOne(obj.id);
    var event = Events.findOne();
    var rounds = bracket.rounds
    var bracketMeta = Instances.findOne().brackets[this.props.index]
    if (this.state.win == true){
      return <WinnersBracket rounds={bracket.rounds} id={bracket._id} eid = {event._id} format={bracketMeta.format.baseFormat} />
    }
    else{
      return <LosersBracket rounds={bracket.rounds} id={bracket._id} eid = {event._id} format={bracketMeta.format.baseFormat} />
    }
  }

  winnersBracket(obj){
    var bracketMeta = Instances.findOne().brackets[this.props.index]
    return (
      [
        bracketMeta.format.baseFormat != "single_elim" ? (
          <div style={{marginBottom: 30}}>
            <button style={{width:150, marginRight:15, backgroundColor: this.state.win==true? "#FF6000":""}}onClick={() => { this.setState({ win: true }) }}>WINNERS</button>
            <button style={{width:150, backgroundColor: this.state.win==false? "#FF6000":""}}onClick={() => { this.setState({ win: false }) }}>LOSERS</button>
          </div>
        ) : (
          <div style={{padding: 20}}></div>
        ),
        <div style={{paddingLeft: 20}}>
          { this.chooseBracket(obj) }
        </div>
      ]
    );
  }


  _content(tabs, obj) {
    switch(tabs[this.state.index]) {
      case "Participants": return this.participants(obj.participants);
      case "Leaderboard": return this.leaderboard(obj);
      case "Bracket": return this.winnersBracket(obj);
      case "Matches": return this.matches(obj.id);
      case "Details": return this.details(obj);
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
        <div className="col col-1" style={{overflow:"hidden",padding: "20px 60px"}}>
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
