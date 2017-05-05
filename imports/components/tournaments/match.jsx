import React, { Component } from "react";

// Requires match ID

export default class Match extends Component {

  profileImageOrDefault(id) {
    const user = Meteor.users.findOne(id);
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  render() {
    const match = Matches.findOne(this.props.id);
    if(!match) {
      return null;
    }
    const isP1Winner = match.winner && match.winner.alias == this.props.players[0].alias;
    const isP2Winner = match.winner && match.winner.alias == this.props.players[1].alias;
    return (
      <div className="col" style={{width: 400, marginLeft: 10, marginBottom: 10, cursor: "pointer"}} onClick={this.props.onClick}>
        <div style={{padding: 5, backgroundColor: "#111"}}>
          { this.props.header }
        </div>
        <div className="row flex-pad x-center" style={{backgroundColor: "#666", position: "relative"}}>
          <div className={`row match-names ${isP1Winner ? "winner" : ""}`} style={{top: 0}}>
            <span>
              <sup className="match-seed">
              [ { this.props.players[0].seed } ]
              </sup>
              { this.props.players[0].alias }
            </span>
          </div>
          <img src={this.profileImageOrDefault(this.props.players[0].id)} style={{width: 100, height: 100}} />
          <div className="col-1 col x-center" style={{padding: 10}}>
            <h5 style={{margin: "10px 0"}}>VERSUS</h5>
          </div>
          <img src={this.profileImageOrDefault(this.props.players[1].id)} style={{width: 100, height: 100}} />
          <div className={`row match-names justify-end ${isP2Winner ? "winner" : ""}`} style={{bottom: 0}}>
            <span>
              { this.props.players[1].alias }
              <sub className="match-seed">
                [ { this.props.players[1].seed } ]
              </sub>
            </span>
          </div>
        </div>
        <div style={{padding: 5, backgroundColor: "#111"}}>
          <div className="row flex-pad">
            { this.props.footer }
          </div>
        </div>
      </div>
    )
  }
}
