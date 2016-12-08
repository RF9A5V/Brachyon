import React, { Component } from "react";
import Games from "/imports/api/games/games.js";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameTemplate from "/imports/components/public/search_results/game_template.jsx";

import { GameBanners } from "/imports/api/games/game_banner.js";

import FontAwesome from "react-fontawesome";

export default class BracketForm extends Component {

  constructor(props) {
    super(props);
    var subFormat = null;
    var format = this.props.format || {};
    if(format.hasOwnProperty("groupFormat")){
      subFormat = "GROUP";
    }
    else if(format.hasOwnProperty("poolFormat")) {
      subFormat = "POOL";
    }
    var game = Games.findOne(props.game);
    if(game) {
      this.state = {
        id: game._id,
        name: game.name,
        bannerUrl: game.bannerUrl,
        format: subFormat || "NONE"
      }
    }
    else {
      this.state = {
        format: "NONE"
      };
    }
    for(var i in format){
      this.state[i] = format[i];
    }
  }

  componentWillReceiveProps(props) {
    var subFormat = null;
    var format = this.props.format || {};
    if(format.hasOwnProperty("groupFormat")){
      subFormat = "GROUP";
    }
    else if(format.hasOwnProperty("poolFormat")) {
      subFormat = "POOL";
    }
    var game = Games.findOne(props.game);
    if(game) {
      this.state = {
        id: game._id,
        name: game.name,
        bannerUrl: game.bannerUrl,
        format: subFormat || "NONE"
      }
    }
    else {
      this.state = {
        format: "NONE"
      };
    }
    for(var i in format){
      this.state[i] = format[i];
    }
    // Only works for basic bracket formats.
    this.refs.format.value = props.format.baseFormat;
  }

  onGameSelect(game) {
    this.setState({
      id: game._id,
      name: game.name,
      bannerUrl: game.bannerUrl
    })
  }

  formatForm() {
    if(this.state.format == "NONE") {
      return (
        <div className="col">
          <div className="row center">
            {
              // <span style={{marginBottom: 10}}>
              //   All participants will go straight into this bracket!
              // </span>
            }
          </div>
          {
            // <h5 style={{marginBottom: 20}}>Bracket Organization</h5>
          }
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
          <div className="row center">

          {
            // <span style={{marginBottom: 10}}>
            //   Participants will be divided into groups, then winners of the group will play each other at the end!
            // </span>
          }
          </div>
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
          <div className="row center">
            {
              // <span style={{marginBottom: 10}}>
              //   Participants will be divided up into brackets, then winners of each bracket will play each other at the end!
              // </span>
            }
          </div>
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
      game: this.state.id,
      format
    }
  }

  render() {
    return (
      <div className="row">
        {
        // <h5>Bracket Name</h5>
        // <input ref="name" defaultValue={this.props.name} />
        }
        {
          this.state.bannerUrl ? (
            <div style={{textAlign: "center"}}>
              <img style={{width: "auto", height: 160, border: "solid 4px #111"}} src={this.state.bannerUrl} />
            </div>
          ) : (
            ""
          )
        }
        <div style={{marginLeft: 20}} className="col col-1">
          <div className="row flex-pad">
            <h5>Game</h5>
            {
              this.props.deletable ? (
                <FontAwesome name="minus" onClick={() => {this.props.delfunc(this.props.key)}} />
              ) : ( "" )
            }
          </div>

          <AutocompleteForm ref="game" publications={["game_search"]} types={[
            {
              type: Games,
              template: GameTemplate,
              name: "Game"
            }
          ]} onChange={this.onGameSelect.bind(this)} value={(this.state.name || "")} id={this.state.id}/>
          <div style={{border: "solid 2px white", padding: 20, position: "relative", marginTop: 20}}>
            <div className="row center" style={{position: "absolute", left: 0, top: -12.5, width: "100%"}}>
              <h5 style={{backgroundColor: "#666", padding: "0 20px"}}>Bracket Format</h5>
            </div>
            {

              // <div className="row center x-center" style={{margin: "20px 0"}}>
              //   <span className={`format-select ${this.state.format == "NONE" ? "active" : ""}`} onClick={() => { this.setState({format: "NONE"}) }}>NONE</span>
              //   <span style={{margin: "0 40px"}}>|</span>
              //   <span className={`format-select ${this.state.format == "POOL" ? "active" : ""}`} onClick={() => { this.setState({format: "POOL"}) }}>POOL</span>
              //   <span style={{margin: "0 40px"}}>|</span>
              //   <span className={`format-select ${this.state.format == "GROUP" ? "active" : ""}`} onClick={() => { this.setState({format: "GROUP"}) }}>GROUP</span>
              // </div>
            }
            {
              this.formatForm()
            }
          </div>
        </div>
      </div>
    )
  }
}
