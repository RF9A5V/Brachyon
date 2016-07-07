import React, { Component } from 'react';

import SelectInput from "../../public/select.jsx";
import AutocompleteForm from "../../public/autocomplete_form.jsx";

import Games from "/imports/api/games/games.js";
import GameResultTemplate from "../../public/search_results/game_template.jsx";

export default class OrganizationPanel extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      gameBanner: props.gameBanner
    };
  }

  onClick(e) {
    this.props.updateSuite(this.values());
  }

  values() {
    return {
      format: this.refs.format.value(),
      gameId: this.refs.game.value(),
      gameBanner: this.state.gameBanner
    }
  }

  gameIfExists() {
    if(this.state.gameBanner) {
      return (<img style={{width: "100%", height: "auto"}} src={this.state.gameBanner} />)
    }
    else if(this.props.gameBanner) {
      return (<img style={{width: "100%", height: "auto"}} src={this.props.gameBanner} />)
    }
    return (<div></div>);
  }

  onGameChange(obj) {
    if(obj.banner){
      this.setState({
        gameBanner: obj.banner
      })
    }
    else {
      this.setState({
        gameBanner: null
      })
    }
  }

  render() {
    return (
      <div className="col" style={{position: "relative"}}>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="row" style={{alignItems: "flex-start"}}>
          <div className="side-tab-panel">
            <label>Format</label>
            <SelectInput ref="format" choices={["Single Elimination", "Double Elimination", "Swiss", "Round Robin"]} />
          </div>
          <div className="side-tab-panel">
            <label style={{marginBottom: (this.state.gameBanner || this.props.gameBanner) ? 15 : 0}}>Game Played</label>
            {
              this.gameIfExists()
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
          <div style={{minWidth: "calc(85vw - 480px)", height: 1}}>
          </div>
        </div>
      </div>
    );
  }
}
