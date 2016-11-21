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
    return GameBanners.findOne(Games.findOne(gameID).banner).link();
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
        <div className="row">
          <div className="submodule-section col">
            {
              brackets.map((bracket, i) => {
                var game = Games.findOne(bracket.game);
                return (
                  <div className={`sub-section-select ${this.state.index == i ? "active" : ""}`} onClick={() => { this.setState({index: i}) }}>
                    { game.name }
                  </div>
                )
              })
            }
          </div>
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
