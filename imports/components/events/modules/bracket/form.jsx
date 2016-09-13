import React, { Component } from "react";
import Games from "/imports/api/games/games.js";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameTemplate from "/imports/components/public/search_results/game_template.jsx";

export default class BracketForm extends Component {

  constructor(props) {
    super(props);
    var blah = null;
    var format = this.props.format || {};
    if(format.hasOwnProperty("groupFormat")){
      blah = "GROUP";
    }
    else if(format.hasOwnProperty("poolFormat")) {
      blah = "POOL";
    }
    this.state = {
      game: Games.findOne(this.props.game),
      gameId: this.props.game,
      format: blah || "NONE"
    }
    for(var i in format){
      this.state[i] = format[i];
    }
  }

  onGameSelect(game) {
    this.setState({
      game
    })
  }

  formatForm() {
    if(this.state.format == "NONE") {
      return (
        <div className="col">
          <span style={{marginBottom: 10}}>
            All participants will go straight into this bracket!
          </span>
          <label>Bracket Organization</label>
          <select ref="format" defaultValue={this.state.baseFormat}>
            <option value="single_elim">
              Single Elimination
            </option>
            <option value="double_elim">
              Double Elimination
            </option>
            <option value="swiss">
              Swiss
            </option>
            <option value="round_robin">
              Round Robin
            </option>
          </select>
        </div>
      )
    }
    else if(this.state.format == "GROUP") {
      return (
        <div className="col">
          <span style={{marginBottom: 10}}>
            Participants will be divided into groups, then winners of the group will play each other at the end!
          </span>
          <label>Group Breakdown</label>
          <select style={{marginBottom: 10}} ref="groupFormat">
            <option value="swiss" selected={this.state.groupFormat == "swiss"}>
              Swiss
            </option>
            <option value="round_robin" selected={this.state.groupFormat == "round_robin"}>
              Round Robin
            </option>
          </select>
          <label>Finals Breakdown</label>
          <select ref="finalFormat">
            <option value="single_elim" selected={this.state.finalFormat == "single_elim"}>
              Single Elimination
            </option>
            <option value="double_elim" selected={this.state.finalFormat == "double_elim"}>
              Double Elimination
            </option>
          </select>
        </div>
      )
    }
    else if(this.state.format == "POOL") {
      return (
        <div className="col">
          <span style={{marginBottom: 10}}>
            Participants will be divided up into brackets, then winners of each bracket will play each other at the end!
          </span>
          <label>Pool Breakdown</label>
          <select style={{marginBottom: 10}} ref="poolFormat">
            <option value="single_elim" selected={this.state.poolFormat == "single_elim"}>
              Single Elimination
            </option>
            <option value="double_elim" selected={this.state.poolFormat == "double_elim"}>
              Double Elimination
            </option>
          </select>
          <label>Finals Breakdown</label>
          <select ref="finalFormat">
            <option value="single_elim" selected={this.state.finalFormat == "single_elim"}>
              Single Elimination
            </option>
            <option value="double_elim" selected={this.state.finalFormat == "double_elim"}>
              Double Elimination
            </option>
          </select>
        </div>
      )
    }
    else {
      return (
        <div>
          Something Broke!
        </div>
      )
    }
  }


  value() {
    var format = {};
    if(this.state.format == "NONE") {
      format = {
        baseFormat: this.refs.format.value
      }
    }
    else if(this.state.format == "GROUP") {
      format = {
        groupFormat: this.refs.groupFormat.value,
        finalFormat: this.refs.finalFormat.value
      }
    }
    else {
      format = {
        poolFormat: this.refs.poolFormat.value,
        finalFormat: this.refs.finalFormat.value
      }
    }
    return {
      game: this.state.game._id,
      name: this.refs.name.value,
      format
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
        ]} onChange={this.onGameSelect.bind(this)} id={this.props.game} />
        <span>Format Select</span>
        <div className="row" style={{justifyContent: "space-around", marginBottom: 20}}>
          <span className={`format-select ${this.state.format == "GROUP" ? "active" : ""}`} onClick={() => { this.setState({format: "GROUP"}) }}>GROUP</span>
          <span>/</span>
          <span className={`format-select ${this.state.format == "POOL" ? "active" : ""}`} onClick={() => { this.setState({format: "POOL"}) }}>POOL</span>
          <span>/</span>
          <span className={`format-select ${this.state.format == "NONE" ? "active" : ""}`} onClick={() => { this.setState({format: "NONE"}) }}>NONE</span>
        </div>
        {
          this.formatForm()
        }
      </div>
    )
  }
}
