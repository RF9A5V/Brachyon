import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Brackets from "/imports/api/brackets/brackets.js";

export default class MatchList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sub: Meteor.subscribe("brackets", props.id, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      open: false,
      filter: "waiting"
    }
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.image) {
      return user.profile.image;
    }
    return "/images/profile.png";
  }

  scoreModalContent() {
    var match = Matches.findOne(this.state.id);
    if(!match) {
      return "";
    }

    if(!match.startedAt) {
      return (
        <div className="row center">
          <button onClick={() => {
            Meteor.call("match.start", this.state.id, (err) => {
              if(err) {
                return toastr.error(err.reason);
              }
              this.forceUpdate();
            })
          }}>Start Match</button>
        </div>
      )
    }

    var scoreComp = match.players.map((p, i) => {

      var cb = (val) => {
        Meteor.call("events.brackets.updateMatchScore", this.state.id, i == 0, val, () => {
          this.forceUpdate();
        });
      }

      return (
        <div className="col x-center col-1">
          <img src={this.profileImageOrDefault(p.id)} style={{width: 200, height: 200, borderRadius: "100%", marginBottom: 20}} />
          <span style={{fontSize: 20, marginBottom: 20}}>{ p.alias }</span>
          <div className="row x-center">
            <FontAwesome name="caret-left" size="3x" onClick={() => { cb(-1) }} />
            <span style={{fontSize: 24, padding: 10, backgroundColor: "#333", margin: "0 20px"}}>{ p.score }</span>
            <FontAwesome name="caret-right" size="3x" onClick={() => { cb(1) }} />
          </div>
        </div>
      )
    });
    return (
      <div className="col">
        <div className="row" style={{marginBottom: 20}}>
          { scoreComp }
        </div>
        <div className="row center">
          <button style={{marginRight: 10}}>View</button>
          <button onClick={() => {
            var func = this.props.format == "single_elim" ? "events.advance_single" : "events.advance_double";
            Meteor.call(func, Brackets.findOne()._id, this.state.bracket, this.state.round, this.state.match, (err) => {
              if(err) {
                return toastr.error(err.reason);
              }
              else {
                this.setState({ open: false });
              }
            });
          }}>End</button>
        </div>
      </div>
    )
  }

  filterSelect() {
    var options = [
      {
        type: "Waiting",
        value: "waiting"
      },
      {
        type: "Running",
        value: "running",
      },
      {
        type: "Completed",
        value: "completed"
      },
      {
        type: "All",
        value: "all"
      }
    ]
    return (
      <select onChange={(e) => { this.setState({ filter: e.target.value }) }}>
        {
          options.map(o => {
            return (
              <option value={o.value}>{ o.type }</option>
            )
          })
        }
      </select>
    )
  }

  render() {
    if(!this.state.ready) {
      return (
        <div></div>
      )
    }
    var bracket = Brackets.findOne();
    return (
      <div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
          {
            this.scoreModalContent()
          }
        </Modal>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <div style={{backgroundColor: "#666", padding: 10}}>
            { this.filterSelect() }
          </div>
        </div>
        {
          bracket.rounds.map((b, i) => {
            var content = b.map((r, j) => {
              if(i == 1) {
                j -= 1;
              }
              var matches = r.map((m, k) => {
                if(!m || !m.id) {
                  return "";
                }
                var match = Matches.findOne(m.id);
                if(match.players[0] == null || match.players[1] == null) {
                  return "";
                }
                if(this.state.filter == "waiting" && match.startedAt) {
                  return "";
                }
                else if(this.state.filter == "running" && (!match.startedAt || match.endedAt)) {
                  return "";
                }
                else if(this.state.filter == "completed" && !match.endedAt) {
                  return "";
                }
                var imgStyle = {
                  width: 100, height: 100
                }
                return (
                  <div className="row flex-pad x-center" style={{width: 400, marginBottom: 10, backgroundColor: "#666", marginRight: 10}} onClick={() => { this.setState({ id: m.id, open: true, bracket: i, round: j, match: k }) }}>
                    <img src={this.profileImageOrDefault(match.players[0].id)} style={imgStyle} />
                    <div className="col-1 col x-center" style={{padding: 10}}>
                      <span style={{alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                      <h5 style={{margin: "10px 0"}}>VERSUS</h5>
                      <span style={{alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                    </div>
                    <img src={this.profileImageOrDefault(match.players[1].id)} style={imgStyle} />
                  </div>
                )
              }).filter(m => {
                return m != "";
              });
              if(matches.length > 0) {
                return [
                  <h4 style={{marginBottom: 10}}>Round {j + 1}</h4>,
                  <div className="row" style={{flexWrap: "wrap"}}>
                    { matches }
                  </div>
                ];
              }
              return "";
            }).filter(r => { return r != "" });
            if(content.length > 0) {
              var header = "Winner's Bracket";
              if(i == 1) {
                header = "Loser's Bracket";
              }
              else if(i == 2) {
                header = "Grand Finals";
              }
              return [
                <h1 style={{textAlign: "center"}}>{ header }</h1>,
                content
              ]
            }
            return "";
          })
        }
      </div>
    )
  }
}
