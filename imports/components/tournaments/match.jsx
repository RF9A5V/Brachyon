import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

// Requires match ID

export default class Match extends ResponsiveComponent {

  profileImageOrDefault(id) {
    const user = Meteor.users.findOne(id);
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  renderBase(opts) {
    const match = Matches.findOne(this.props.id);
    if(!match) {
      return null;
    }
    const isP1Winner = match.winner && match.winner.alias == this.props.players[0].alias;
    const isP2Winner = match.winner && match.winner.alias == this.props.players[1].alias;

    const station = match.station ? `, Station ${match.station}` : "";

    return (
      <div className="col" style={{width: opts.mobile ? "100%" : 400, marginLeft: 10, marginBottom: 10, cursor: "pointer"}} onClick={this.props.onClick}>
        <div style={{padding: 5, backgroundColor: "#111", fontSize: opts.fontSize}}>
          { this.props.header }{ station }
        </div>
        <div className="row flex-pad x-center" style={{backgroundColor: "#666", position: "relative"}}>
          <div className={`row match-names ${isP1Winner ? "winner" : ""}`} style={{top: 0}}>
            <span style={{fontSize: opts.fontSize}}>
              <sup className="match-seed" style={{fontSize: opts.fontSize}}>
              [ { this.props.players[0].seed } ]
              </sup>
              { this.props.players[0].alias }
            </span>
          </div>
          <img src={this.profileImageOrDefault(this.props.players[0].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
          <div className="col-1 col x-center" style={{padding: 10}}>
            <h5 style={{margin: "10px 0"}}>VERSUS</h5>
          </div>
          <img src={this.profileImageOrDefault(this.props.players[1].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
          <div className={`row match-names justify-end ${isP2Winner ? "winner" : ""}`} style={{bottom: 0}}>
            <span style={{fontSize: opts.fontSize}}>
              { this.props.players[1].alias }
              <sub className="match-seed" style={{fontSize: opts.fontSize}}>
                [ { this.props.players[1].seed } ]
              </sub>
            </span>
          </div>
        </div>
        <div style={{padding: 5, backgroundColor: "#111"}}>
          <div className="row flex-pad" style={{fontSize: opts.fontSize}}>
            { this.props.footer }
          </div>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      fontSize: "1rem",
      imgDim: 100
    })
  }

  renderMobile() {
    return this.renderBase({
      mobile: true,
      fontSize: "2.5rem",
      imgDim: 250
    })
  }
}
