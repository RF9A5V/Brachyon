import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameResultTemplate from "/imports/components/public/search_results/game_template.jsx";

import Games from "/imports/api/games/games.js";

class GameBracketSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      game: null,
      format: "NONE"
    }
  }

  onGameSelect(game){
    this.setState({
      game: {
        id: game._id,
        name: game.name,
        banner: Images.findOne(game.banner).url()
      },

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
          <label>Bracket Organization</label>
          <select ref="format">
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
            <option value="swiss">
              Swiss
            </option>
            <option value="round_robin">
              Round Robin
            </option>
          </select>
          <label>Finals Breakdown</label>
          <select ref="finalFormat">
            <option value="single_elim">
              Single Elimination
            </option>
            <option value="double_elim">
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
            <option value="single_elim">
              Single Elimination
            </option>
            <option value="double_elim">
              Double Elimination
            </option>
          </select>
          <label>Finals Breakdown</label>
          <select ref="finalFormat">
            <option value="single_elim">
              Single Elimination
            </option>
            <option value="double_elim">
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
      game: this.state.game.id,
      format: format
    }
  }

  render() {
    return (
      <div className="col game-bracket-container">
        {
          this.props.deletable ? (
            <div className="row">
              <div className="col-1"></div>
              <FontAwesome name="minus" onClick={this.props.cb} />
            </div>
          ) : (
            ""
          )
        }

        <label>Bracket Name</label>
        <input type="text" ref="bracketName" style={{margin: 0, marginBottom: 10}} />
        <label>Game Select</label>
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
        <label>Format Select</label>
        <div className="row" style={{justifyContent: "space-around"}}>
          <span className={`format-select ${this.state.format == "GROUP" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>GROUP</span>
          <span>/</span>
          <span className={`format-select ${this.state.format == "POOL" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>POOL</span>
          <span>/</span>
          <span className={`format-select ${this.state.format == "NONE" ? "active" : ""}`} onClick={this.onFormatSelect.bind(this)}>NONE</span>
        </div>
        {
          this.formatForm()
        }
      </div>
    )
  }
}

export default class OrganizePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bracketCount: 1,
      brackets: [1]
    };
  }

  values() {
    return Object.keys(this.refs).map((key, index) => {
      try {
        return this.refs[key].values();
      }
      catch(error) {
        toastr.error("All fields in the Game Bracket form have to be complete!", "Error!");
        throw error;
      }
    });
  }

  render() {
    return (
      <div className="col">
        {
          this.state.brackets.map((bracket, key) => {
            if(bracket == null){
              return "";
            }
            if(this.state.bracketCount > 1){
              return (<GameBracketSelect key={key} deletable={true} cb={(e) => { this.state.brackets[key] = null; this.state.bracketCount--; this.forceUpdate() }} ref={key} />)
            }
            return (<GameBracketSelect key={key} ref={key} />);
          })
        }
        {
          this.state.bracketCount < 15 ? (
            <button onClick={(e) => { e.preventDefault(); this.state.bracketCount++; this.state.brackets.push(1); this.forceUpdate() }}>Add A Bracket</button>
          ) : (
            ""
          )
        }
        <button onClick={(e) => { console.log(this.values()) }}>Test</button>
      </div>
    )
  }
}
