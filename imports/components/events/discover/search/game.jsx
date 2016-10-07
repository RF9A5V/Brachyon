import React, { Component } from "react";

import Games from "/imports/api/games/games.js";

import AutocompleteForm from "../../../public/autocomplete_form.jsx";
import GameResultTemplate from "../../../public/search_results/game_template.jsx";

export default class GameSearchInput extends Component {

  onGameSelect(gameObj) {
    this.props.onChange(gameObj._id);
  }

  render() {
    return (
      <div className="col" style={{margin: "0 5px"}}>
        <span>Game</span>
        <AutocompleteForm ref="game" publications={[
          "game_search"
        ]} types={[
          {
            type: Games,
            template: GameResultTemplate,
            name: "Game"
          }
        ]} onChange={this.onGameSelect.bind(this)} placeholder="Search by Game" />
      </div>
    )
  }
}
