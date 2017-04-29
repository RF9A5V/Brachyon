import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import Games from "/imports/api/games/games.js";
import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import GameTemplate from "/imports/components/public/search_results/game_template.jsx";
import OptionsModal from "./options_modal.jsx";

import { GameBanners } from "/imports/api/games/game_banner.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BracketForm extends ResponsiveComponent {

  constructor(props) {
    super(props);
    if(!this.state) {
      this.state = {};
    }
    this.state.open = false;
    var subFormat = null;
    var format = props.format || {};
    if(format.hasOwnProperty("groupFormat")){
      subFormat = "GROUP";
    }
    else if(format.hasOwnProperty("poolFormat")) {
      subFormat = "POOL";
    }
    var game = Games.findOne(props.game) || props.gameObj;
    if(game) {
      this.state.game = {
        id: game._id,
        gameName: game.name,
        bannerUrl: game.bannerUrl
      }
    }
    else {
      this.state.game = {}
    }
    this.state.format = subFormat || "NONE"
    this.state.name = props.name || "";
  }

  componentWillReceiveProps(props) {
    var subFormat = null;
    var format = props.format || {};
    if(format.hasOwnProperty("groupFormat")){
      subFormat = "GROUP";
    }
    else if(format.hasOwnProperty("poolFormat")) {
      subFormat = "POOL";
    }
    this.state.format = subFormat || "NONE"
    var game = Games.findOne(props.game) || props.gameObj;
    if(game) {
      this.state.game.id = game._id;
      this.state.game.gameName = game.name;
      this.state.game.bannerUrl = game.bannerUrl;
    }

    if(props.format) {
      // Only works for basic bracket formats.
      this.refs.format.value = props.format.baseFormat;
    }
    this.state.name = props.name || "";
  }

  onNameChange() {
    var name = this.refs.name.value;
    if(this.props.onChange) {
      this.props.onChange(null, { name });
    }
  }

  formatForm(opts) {
    if(this.state.format == "NONE") {
      return (
        <div className="col">
          <select ref="format" defaultValue={(this.props.format || {}).baseFormat} onChange={(e) => {
            if(this.props.onChange) {
              var game = this.state.game;
              this.props.onChange(game, { baseFormat: e.target.value })
            }
          }} style={{fontSize: opts.fontSize}}>
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
      game: (this.state.game || {}).id,
      format,
      name: this.refs.name.value,
      options: this.refs.options.value()
    }
  }

  loadGames(value, opts) {
    if(this.state.game && this.state.game.name != value) {
      this.state.game = {
        name: value
      }
    }
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

  renderBase(opts) {
    const imgHeight = "340px";
    return (
      <div className={opts.direction} style={{backgroundColor: "#111"}}>
        {
          this.state.game && this.state.game.bannerUrl ? (
            <div style={{textAlign: "center", position: "relative"}}>
              <img style={{width: `calc(${imgHeight} * 3 / 4)`, height: imgHeight, border: "solid 4px #111"}} src={this.state.bannerUrl} />
              <div style={{width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, #111)", position: "absolute", top: 0, left: 0}}>
              </div>
            </div>
          ) : (
            ""
          )
        }
        <div className="col col-1" style={{padding: 20}}>
          <div className="row justify-end">
            {
              this.props.deletable ? (
                <FontAwesome name="times" onClick={() => {this.props.delfunc()}} style={{fontSize: opts.fontSize}} />
              ) : ( "" )
            }
            <FontAwesome name="cog" onClick={() => {
              this.setState({
                open: true
              })
            }} style={{fontSize: opts.fontSize}} />
          </div>
          <label style={{fontSize: opts.fontSize}} className="input-label">Bracket Name</label>
          <input className={opts.inputClass} ref="name" defaultValue={this.state.name} onChange={this.onNameChange.bind(this)} style={{marginRight: 0, marginTop: 0}} type="text" />
          <div className="col" style={{position: "relative"}}>
            <label style={{fontSize: opts.fontSize}} className="input-label">Game</label>
            <input type="text" className={opts.inputClass} onChange={(e) => {
              const value = e.target.value;
              this.loadGames(value, opts.limit);
            }} defaultValue={this.state.game.gameName} style={{marginRight: 0, marginTop: 0}} ref="game" />
            {
              this.state.gameList ? (
                <div style={{position: "absolute", top: "calc(100% - 20px)", width: "100%", zIndex: 2}}>
                {
                  this.state.gameList.map(g => {
                    return (
                      <GameTemplate {...g} onClick={() => {
                        const game = {
                          id: g._id,
                          name: g.name,
                          bannerUrl: g.bannerUrl
                        }
                        this.setState({
                          game,
                          gameList: null
                        });
                        this.refs.game.value = g.name;
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
          <div style={{border: "solid 2px white", padding: opts.borderPad, position: "relative", marginTop: 20}}>
            <div className="row center" style={{position: "absolute", left: 0, top: opts.top, width: "100%"}}>
              <h5 style={{backgroundColor: "#111", padding: "0 20px", fontSize: opts.fontSize}}>Bracket Format</h5>
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
              this.formatForm(opts)
            }
          </div>
        </div>
        <OptionsModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} ref="options" options={this.props.options || {}} />
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      inputClass: "",
      fontSize: "1em",
      direction: "row",
      borderPad: 20,
      top: -12.5,
      limit: 3
    });
  }

  renderMobile() {
    return this.renderBase({
      inputClass: "large-input",
      fontSize: "2.5em",
      direction: "col",
      borderPad: 40,
      top: -19.5,
      limit: 5
    });
  }

}
