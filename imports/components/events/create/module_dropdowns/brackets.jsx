import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

import Games from "/imports/api/games/games.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BracketsPanel extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var brackets = null;
    if(props.brackets) {
      brackets = {};
      props.brackets.forEach((b, i) => {
        brackets[i] = {
          name: b.name,
          game: b.game,
          format: b.format,
          options: b.options || {}
        };
      })
    }
    this.state = {
      brackets,
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
    const min = Math.min.apply(null, Object.keys(this.state.brackets).map(i => { return parseInt(i) }));
    Object.keys(this.state.brackets).forEach(key => {
      const brackObj = this.refs[key].value();
      if(!brackObj.gameName && !brackObj.game) {
        toastr.error("Each bracket given requires a game!");
        throw new Error("Bracket at key " + key + " requires a game.");
      }
      else {
        brackObj.index = parseInt(key) - min;
        brackets.push(brackObj);
      }
    });
    return brackets;
  }

  addBracket() {
    if(!this.state.brackets) {
      this.state.brackets = { }
    }
    if(this.props.isLeague) {
      return;
    }
    var bracketIndex = Math.max.apply(null, Object.keys(this.state.brackets).map(k => { return parseInt(k) }));
    if(bracketIndex < 0) {
      bracketIndex = 0;
    }
    this.state.brackets[++bracketIndex] = { };
    this.props.setStatus(true);
    this.props.onBracketNumberChange(Object.keys(this.state.brackets));
  }

  deleteBracket(key) {
    delete this.state.brackets[key];
    this.props.onBracketNumberChange(Object.keys(this.state.brackets));
    this.forceUpdate();
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
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
      fColor = "#111";
    }
    else if(window.location.pathname.indexOf("league") >= 0){
      eColor = "#FF6000";
      fColor = "#111";
    }
    else{}
    return (
      <div className="col">
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center module-toggle" style={{width: opts.toggleWidth, height: opts.toggleWidth / 3}} onClick={() => {
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
            <div className="row center x-center" style={{backgroundColor: active ? eColor : "white", width: (opts.toggleWidth - 5) / 2, height: opts.toggleWidth / 3 - 10, position: "relative", left: active ? opts.toggleWidth / 2 - 2.5 : 5}}>
              <span style={{color: active ? fColor : "#333", fontSize: opts.fontSize}}>
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
      fontSize: "2em",
      fontWidth: "90%",
      toggleWidth: 200
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      fontWidth: "50%",
      toggleWidth: 100
    });
  }

}
