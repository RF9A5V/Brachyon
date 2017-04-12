import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

import Games from "/imports/api/games/games.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BracketsPanel extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      brackets: null,
      item: 0
    }
  }

  componentWillReceiveProps(next) {
    if(next.status && !this.state.brackets) {
      this.state.brackets = { 0: {} };
      this.props.onBracketNumberChange(Object.keys(this.state.brackets));
    }
    else if(!next.status) {
      this.state.brackets = null;
      this.props.onBracketNumberChange([]);
    }
  }

  value() {
    if(!this.props.status || !this.state.brackets) {
      return null;
    }
    var brackets = [];
    Object.keys(this.state.brackets).forEach(key => {
      var bracket = this.state.brackets[key];
      var gameObj = bracket.gameObj;
      if(!gameObj || !bracket.format) {
        toastr.error("Each bracket given requires a game!");
        throw new Error("Bracket at key " + key + " requires a game.");
      }
      else {
        var temp = {
          format: bracket.format,
          game: bracket.gameObj._id
        }
        brackets.push(temp);
      }
    })
    return brackets;
  }

  addBracket() {
    if(!this.state.brackets) {
      this.state.brackets = { }
    }
    var bracketIndex = Math.max.apply(null, Object.keys(this.state.brackets).map(k => { return parseInt(k) }));
    if(bracketIndex < 0) {
      bracketIndex = 0;
    }
    this.state.brackets[++bracketIndex] = { };
    console.log(this.state.brackets);
    this.props.setStatus(true);
    this.props.onBracketNumberChange(Object.keys(this.state.brackets));
  }

  deleteBracket(key) {
    delete this.state.brackets[key];
    this.props.onBracketNumberChange(Object.keys(this.state.brackets));
  }

  itemDescriptions(opts) {
    var descriptions = [
      "Choose from Single Elimination, Double Elimination, Round Robin and Swiss. After you publish your event, a bracket page will be generated where participants can be added manually and/or users can request to join (in which case you will receive notification."
    ];
    return descriptions[this.state.item].split("\n").map(item => {
      return (
        <div className="text-description border-blue" style={{fontSize: opts.fontSize, width: opts.fontWidth}}>
          {
            item
          }
        </div>
      )
    });
  }

  renderBase(opts) {
    var tabs = ["Bracket"];
    var active = this.props.status;
    var eColor, fColor;
    if(window.location.pathname == "/events/create"){
      eColor = "#00BDFF";
      fColor = "#333";
    }
    else if(window.location.pathname == "/leagues/create"){
      eColor = "#FF6000";
      fColor = "#FFF";
    }
    else{}
    return (
      <div className="col">
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center module-toggle" onClick={() => {
            if(!active) {
              this.addBracket();
            }
            else {
              this.setState({
                brackets: null
              });
              this.props.setStatus(false);
            }
          }}>
            <div className="row center x-center" style={{backgroundColor: active ? eColor : "white", width: 45, height: 20, position: "relative", left: active ? 50 : 5}}>
              <span style={{color: active ? fColor : "#333", fontSize: 12}}>
                {
                  active ? (
                    "ON"
                  ) : (
                    "OFF"
                  )
                }
              </span>
            </div>
          </div>
        </div>
        {
          active ? (
            <div>
              <div>
              {
                Object.keys(this.state.brackets).map(key => {
                  var bracket = this.state.brackets[key];
                  var onBracketChange = (key) => {
                    return (game, format) => {
                      if(game == null) {
                        if(!this.state.brackets[key]) {
                          this.state.brackets[key] = {};
                        }
                        this.state.brackets[key].name = format.name;
                      }
                      else {
                        var prev = this.state.brackets[key] || {};
                        this.state.brackets[key] = {
                          gameObj: game,
                          format
                        };
                        this.state.brackets[key].name = prev.name;
                      }

                    }
                  }
                  if(bracket == null){
                    return "";
                  }
                  if(Object.keys(this.state.brackets).length > 1){
                    return (
                      <div className="game-bracket-container">
                        <BracketForm key={key} ref={key} deletable={true} delfunc={() => {this.deleteBracket(key)}} onChange={onBracketChange(key)} {...bracket}/>
                      </div>
                    );
                  }
                  return (
                    <div className="game-bracket-container">
                      <BracketForm key={key} ref={key} onChange={onBracketChange(key)} {...bracket} />
                    </div>
                  );
                })
              }
              </div>
              <div className="center">
                <button onClick={() => { this.addBracket() }}>Add Bracket</button>
              </div>
            </div>
          ) : (
            this.itemDescriptions(opts)
          )
      }
    </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "3em",
      fontWidth: "100%"
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      fontWidth: "50%"
    });
  }

}
