import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SelectInput from "/imports/components/public/select.jsx";
import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";

import Games from "/imports/api/games/games.js";
import GameResultTemplate from "../../public/search_results/game_template.jsx";

export default class OrganizationPanel extends TrackerReact(Component) {

  componentWillMount() {
    self = this;
    this.setState({
      games: Meteor.subscribe("game_search", "", {
        onReady() {
          self.setState({
            loaded: true
          })
        }
      }),
      loaded: false,
      active: false,
      game_id: null
    });
  }

  componentWillUnmount() {
    this.state.games.stop();
  }

  tournamentFormats() {
    return [
      "Single Elimination",
      "Double Elimination",
      "Swiss",
      "Round Robin"
    ];
  }

  value() {
    return {
      active: this.state.active,
      format: this.refs.format.value(),
      game: this.state.game_id
    }
  }

  games() {
    return Games.find({}, { limit: 6 }).fetch();
  }

  showGameBanner(obj) {
    if(obj == null){
      this.state.image = null;
      this.state.game_id = null;
    }
    else {
      this.state.image = obj.banner;
      this.state.game_id = obj.id;
    }
    this.onChange();
  }

  onChange(e) {
    console.log(!this.state.active);
    this.props.onChange(!this.state.active || this.state.image != null);
    this.forceUpdate();
  }

  onGameChange(obj) {
    if(obj.banner){
      this.setState({
        image: obj.banner
      })
    }
    else {
      this.setState({
        image: null
      })
    }
    this.props.onChange(!this.state.active || this.state.image != null);
  }

  render() {
    if(!this.state.loaded){
      return (
        <div></div>
      )
    }
    return (
      <div className="col">
        <div style={{marginBottom: 10}}>
          <i style={{lineHeight: 1.5}}>This part lets you set up a bracket through the format and helps people find your event through the games they play.</i>
        </div>
        <div className="row x-center" style={{marginBottom: 20}}>
          <label style={{margin: 0, marginRight: 20}}>Set up organization now?</label>
          <input type="checkbox" checked={this.state.active} onChange={()=>{ this.state.active=!this.state.active; this.onChange() }} style={{margin: 0}}/>
        </div>
        <div style={{
          display: this.state.active ? "initial" : "none"
        }}>
          <label>Event Format</label>
          <SelectInput ref="format" choices={this.tournamentFormats()} />
          <label>Game Played</label>
          {
            this.state.image ? (
              <div style={{margin: "10px 0"}}>
                <img style={{width: 300, height: "auto"}} src={this.state.image} />
              </div>
            ) : (
              ""
            )
          }
          <AutocompleteForm ref="game" publications={[
            "game_search"
          ]} types={[
            {
              type: Games,
              template: GameResultTemplate,
              name: "Game"
            }
          ]} onChange={this.onGameChange.bind(this)} id={this.props.gameId} />
        </div>
      </div>
    );
  }
}
