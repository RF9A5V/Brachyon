import React, { Component } from "react";

import AutocompleteForm from "../../public/autocomplete_form.jsx";
import GameResultTemplate from "../../public/search_results/game_template.jsx";

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
      game: null,
      image: null
    };
  }

  onGameSelect(game) {
    this.setState({
      game: game._id,
      image: game.banner
    })
  }

  selectedImage() {
    if(this.state.image){
      return (
        <img style={{width: 400, height: "auto"}} src={Games.findOne(game).bannerUrl} />
      )
    }
    return "";
  }

  saveGame(e) {
    e.preventDefault();
    if(this.state.game){
      Meteor.call("users.add_game", this.state.game, function(err){
        if(err){
          toastr.error("Couldn't update your games!", "Error!");
        }
        else {
          toastr.success("Updated your game list!", "Success!");
        }
      })
    }
    else {
      toastr.warning("Specify a game to add first.", "Warning!");
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
          <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={this.saveGame.bind(this)}>Save</button>
          </div>
          {
            this.selectedImage()
          }
          <AutocompleteForm ref="game" publications={[
            "game_search"
          ]} types={[
            {
              type: Games,
              template: GameResultTemplate,
              name: "Game"
            }
          ]} onChange={this.onGameSelect.bind(this)} />
        </div>
      </div>
    );
  }
}
