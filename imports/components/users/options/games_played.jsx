import React, { Component } from "react";

import AutocompleteForm from "../../public/autocomplete_form.jsx";
import GameTemplate from "../../public/search_results/game_template.jsx";

import { GameBanners } from "/imports/api/games/game_banner.js";
import Games from "/imports/api/games/games.js";

class GameOption extends Component {
  render() {
    return (
      <div className="side-tab-panel">
        <div className="row x-center">
          <span className="col-1">Edit Game</span>
          <button style={{marginRight: 10}}>Remove</button>
          <button>Save</button>
        </div>
        <label>{ this.props.name }</label>
        <img src={this.props.bannerUrl} style={{width: 400, height: "auto"}} />
      </div>
    )
  }
}

export default class GameOptionsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameList: null
    }
  }

  saveGame(g) {
    Meteor.call("users.add_game", g, function(err){
      if(err){
        toastr.error("Couldn't update your games!", "Error!");
      }
      else {
        toastr.success("Updated your game list!", "Success!");
      }
    })
  }

  loadGames(value, opts) {
    clearTimeout(this.state.to);
    if(value.length >= 3) {
      this.state.to = setTimeout(() => {
        Meteor.call("games.search", value, (err, data) => {
          if(err) {
            toastr.error(err.reason);
          }
          else {
            this.setState({
              gameList: data
            })
          }
        });
      }, 500);
    }
  }

  render() {
    return (
      <div className="col side-tab-panel" style={{margin:"auto", paddingTop:20}}>
          {
            (Meteor.user().profile.games || []).map(function(id){
              return (
                <div className="about-what">
                  <GameOption {...Games.findOne(id)} />
                </div>
              );
            })
          }
        <h4 className="col-1">Add Games</h4>
        <div className="about-what">
          <div className="col" style={{position: "relative"}}>
            <label className="input-label">Game</label>
            <input type="text" onChange={(e) => {
              const value = e.target.value;
              this.loadGames(value, 3);
            }} style={{marginRight: 0, marginTop: 0}} ref="game" />
            {
              this.state.gameList ? (
                <div style={{position: "absolute", top: "calc(100% - 20px)", width: "100%", zIndex: 2}}>
                {
                  this.state.gameList.map(g => {
                    return (
                      <GameTemplate {...g} onClick={() => {
                        const game = {
                          _id: g._id,
                          name: g.name
                        }
                        this.saveGame(g._id);
                      }} />
                    )
                  })
                }
                </div>
              ) : (
                null
              )
            }
          </div>
        </div>
      </div>
    );
  }
}
