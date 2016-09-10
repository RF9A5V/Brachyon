import React, { Component } from "react";
import Games from "/imports/api/games/games.js";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameTemplate from "/imports/components/public/search_results/game_template.jsx";

export default class BracketForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      game: Games.findOne(this.props.gameId),
      gameId: this.props.gameId
    }
  }

  onGameSelect(game) {
    this.setState({
      game
    })
  }

  value() {
    return {
      game: this.state.game._id,
      name: this.refs.name.value
    }
  }

  render() {
    return (
      <div className="col">
        <span>Bracket Name</span>
        <input ref="name" defaultValue={this.props.name} />
        <span>Game</span>
        <div>
          {
            this.state.game ? (
              <img src={this.state.game.bannerUrl} />
            ) : (
              ""
            )
          }
        </div>
        <AutocompleteForm ref="game" publications={["game_search"]} types={[
          {
            type: Games,
            template: GameTemplate,
            name: "Game"
          }
        ]} onChange={this.onGameSelect.bind(this)} id={this.props.gameId} />
      </div>
    )
  }
}
