import React, { Component } from "react";
import { browserHistory } from "react-router";
import FontAwesome from "react-fontawesome";

import Instances from "/imports/api/event/instance.js";
import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      bracket: Instances.findOne().brackets,
      index: 0
    }
  }

  gameBanner(gameID){
    return Games.findOne(gameID).bannerUrl;
  }

  redirectToBracketPage(index) {
    var event = Events.findOne(this.state.id);
    browserHistory.push(`/events/${event.slug}/brackets/${index}/admin`);
  }

  render() {
    var event = Events.findOne();
    var brackets = Instances.findOne().brackets || [];
    return (
      <div className="submodule-bg" style={{marginTop: 10}}>
        <div className="row" style={{flexWrap: "wrap", paddingBottom: 20}}>
          {
            brackets.map((bracket, i) => {
              var optionStyle = {
                padding: 10,
                marginRight: 10,
                width: 100,
                color: this.state.index == i ? "#0BDDFF" : "white",
                backgroundColor: "#111",
                cursor: "pointer"
              }
              return (
                <div className="row x-center center" style={optionStyle} onClick={() => { this.setState({ index: i }) }}>{Games.findOne(bracket.game).name}</div>
              )
            })
          }
        </div>
        <div className="row">
          {
            this.state.bracket[ this.state.index ] == null ? (
              ""
            ) : (
              <div className="submodule-section col-1 col center x-center">
                <img src={ this.gameBanner(this.state.bracket[ this.state.index ].game) } style={{width: "25%", marginBottom: 20}} />
                <h5>{ this.state.bracket[ this.state.index ].name }</h5>
              </div>
            )
          }
          {
            this.state.bracket[ this.state.index ] == null ? (
              ""
            ) : (
              <div>
                <div className="submodule-section col" style={{minWidth: "250px"}}>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <FontAwesome name="user" size="2x" style={{width: 50, marginRight: 20, textAlign: "center"}} />
                    <h5>{ (this.state.bracket[ this.state.index ].participants || []).length }</h5>
                  </div>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <FontAwesome name="gamepad" size="2x" style={{width: 50, marginRight: 20, textAlign: "center"}} />
                    <h5>{ Games.findOne(this.state.bracket[ this.state.index ].game).name }</h5>
                  </div>
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <FontAwesome name="trophy" size="2x" style={{width: 50, marginRight: 20, textAlign: "center"}} />
                    <h5>${ 0 }</h5>
                  </div>
                  <div className="row center">
                    <button onClick={() => { browserHistory.push(`/events/${Events.findOne(this.state.id).slug}/brackets/${this.state.index}/admin`) }}>Admin Page</button>
                  </div>
                </div>
              </div>
            )
          }
        </div>

      </div>
    )
  }
}
