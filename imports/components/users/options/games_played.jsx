import React, { Component } from "react";

import AutocompleteForm from "../../public/autocomplete_form.jsx";
import GameTemplate from "../../public/search_results/game_template.jsx";

import { GameBanners } from "/imports/api/games/game_banner.js";
import Games from "/imports/api/games/games.js";

import GameBlock from "/imports/components/games/block.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

export default class GameOptionsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameList: null,
      userGames: Games.find({
        _id: {
          $in: Meteor.user().profile.games || []
        }
      }).fetch()
    }
  }

  saveGame(g) {
    Meteor.call("users.add_game", g, (err) => {
      if(err){
        toastr.error("Couldn't update your games!", "Error!");
      }
      else {
        toastr.success("Updated your game list!", "Success!");
        this.state.userGames.push(g);
      }
      this.setState({
        gameList: null
      });
      this.refs.game.value = "";
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
      <div>
        <h4 className="col-1">Add Games</h4>
        <div style={{padding: 10, backgroundColor: "#666"}}>
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
                        this.saveGame(g.id);
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
        <div style={{margin: "10px 0"}}>
          <RowLayout length={4}>
            {
              this.state.userGames.map(function(g){
                return (
                  <GameBlock game={g} onClick={() => {}} />
                );
              })
            }
          </RowLayout>
        </div>
      </div>
    );
  }
}
