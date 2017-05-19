import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameResultTemplate from "/imports/components/public/search_results/game_template.jsx";

import { GameBanners } from "/imports/api/games/game_banner.js";
import Games from "/imports/api/games/games.js";

export default class BracketForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      game: null,
      format: "NONE"
    };
    if(props.game){
      var game = Games.findOne(props.game);
      this.state.game = {
        name: game.name,
        banner: game.bannerUrl
      }
      this.state.id = game._id;
    }
    if(props.format) {
      if(props.format.hasOwnProperty("baseFormat")) {
        this.state.format = "NONE";
        this.state.baseFormat = props.format.baseFormat;
      }
      else if(props.format.hasOwnProperty("groupFormat")) {
        this.state.format = "GROUP";
        this.state.groupFormat = props.format.groupFormat;
        this.state.finalFormat = props.format.finalFormat;
      }
      else {
        this.state.format = "POOL";
        this.state.poolFormat = props.format.poolFormat;
        this.state.finalFormat = props.format.finalFormat;
      }
    }
  }

  onGameSelect(game){
    this.setState({
      game: {
        name: game.name,
        banner: game.bannerUrl
      },
      id: game._id
    });
  }

  onGameReset(e) {
    e.preventDefault();
    this.setState({
      game: null
    });
  }

  onFormatSelect(e) {
    e.preventDefault();
    this.setState({
      format: e.target.textContent
    });
  }

  formatForm() {
    if(this.state.format == "NONE") {
      return (
        <div className="col">
          <span style={{marginBottom: 10}}>
            All participants will go straight into this bracket!
          </span>
          <h5 style={{marginBottom: 20}}>Bracket Organization</h5>
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
          <h5 style={{marginBottom: 20}}>Group Breakdown</h5>
          <select style={{marginBottom: 10}} ref="groupFormat">
            <option value="swiss" selected={this.state.groupFormat == "swiss"}>
              Swiss
            </option>
            <option value="round_robin" selected={this.state.groupFormat == "round_robin"}>
              Round Robin
            </option>
          </select>
          <h5 style={{marginBottom: 20}}>Finals Breakdown</h5>
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
          <h5 style={{marginBottom: 20}}>Pool Breakdown</h5>
          <select style={{marginBottom: 10}} ref="poolFormat">
            <option value="single_elim" selected={this.state.poolFormat == "single_elim"}>
              Single Elimination
            </option>
            <option value="double_elim" selected={this.state.poolFormat == "double_elim"}>
              Double Elimination
            </option>
          </select>
          <h5 style={{marginBottom: 20}}>Finals Breakdown</h5>
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

  values() {
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
    if(this.refs.bracketName.value == null || this.refs.bracketName.value == "") {
      throw new Error("Bracket Name can't be null!");
    }
    if(this.state.game == null) {
      throw new Error("Game selected can't be null!");
    }
    return {
      name: this.refs.bracketName.value,
      game: this.state.id,
      format: format
    }
  }

  render() {
    return (
      <div className="col" style={{width: "100%"}}>
        {
          this.props.deletable ? (
            <div className="row">
              <div className="col-1"></div>
              <FontAwesome name="minus" style={{cursor: "pointer"}} onClick={this.props.cb} />
            </div>
          ) : (
            ""
          )
        }

        <h5>Bracket Name</h5>
        <input type="text" ref="bracketName" defaultValue={this.props.name || ""} />
        <h5>Game</h5>
        {
          this.state.game === null ? (
            <AutocompleteForm ref="game" publications={[
              "game_search"
            ]} types={[
              {
                type: Games,
                template: GameResultTemplate,
                name: "Game"
              }
            ]} onChange={this.onGameSelect.bind(this)} />
          ) : (
            <div style={{position: "relative"}}>
              <img src={this.state.game.banner} style={{width: "100%", height: "auto"}} />
              <FontAwesome style={{position: "absolute", top: 5, right: 5, padding: 5, backgroundColor: "rgba(0, 0, 0, 0.8)"}} name="times" onClick={this.onGameReset.bind(this)} />
              <span style={{fontSize: 18, position: "absolute", left: 5, bottom: 10, padding: 5, backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
                { this.state.game.name }
              </span>
            </div>
          )
        }
        {
          // <h5 style={{marginBottom: 20}}>Format Select</h5>
          // <div className="row center x-center" style={{marginBottom: 20}}>
          //   <span className={`format-select ${this.state.format == "GROUP" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>GROUP</span>
          //   <span style={{margin: "0 40px"}}>|</span>
          //   <span className={`format-select ${this.state.format == "POOL" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>POOL</span>
          //   <span style={{margin: "0 40px"}}>|</span>
          //   <span className={`format-select ${this.state.format == "NONE" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>NONE</span>
          // </div>
        }
        {
          this.formatForm()
        }
      </div>
    )
  }
}
