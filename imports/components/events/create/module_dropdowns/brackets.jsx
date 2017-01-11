import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

import Games from "/imports/api/games/games.js";

export default class BracketsPanel extends Component {

  constructor(props) {
    super(props);
    var bracketCount = Object.keys(props.attrs.brackets || {0 : 1}).pop();
    if(Object.keys(props.attrs.brackets || {}).length == 0) {
      props.attrs.brackets = { 0 : {} };
    }
    this.state = {
      item: 0,
      bracketCount
    };
  }

  componentWillReceiveProps(props) {
    var bracketCount = Object.keys(props.attrs.brackets || {0 : 1}).pop();
    if(Object.keys(props.attrs.brackets || {}).length == 0) {
      props.attrs.brackets = { 0 : {} };
    }
    this.setState({
      item: 0,
      bracketCount
    });
  }

  addBracket() {
    this.props.attrs.brackets[++this.state.bracketCount] = {};
    this.forceUpdate();
  }

  deleteBracket(key) {
    delete this.props.attrs.brackets[key];
    this.forceUpdate();
  }

  itemDescriptions() {
    var descriptions = [
      "Choose from Single Elimination, Double Elimination, Round Robin and Swiss. After you publish your event, a bracket page will be generated where participants can be added manually and/or users can request to join (in which case you will receive notification(s))."
    ];
    return descriptions[this.state.item].split("\n").map(item => {
      return (
        <p>
          {
            item
          }
        </p>
      )
    });
  }

  render() {
    var tabs = ["Bracket"];
    return (
      <div className="col">
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{cursor: "pointer", backgroundColor: "#333", width: 100, height: 30}} onClick={this.props.onToggle}>
            <div className="row center x-center" style={{backgroundColor: this.props.selected ? "#FF6000" : "white", width: 45, height: 20, position: "relative", left: this.props.selected ? 50 : 5}}>
              <span style={{color: this.props.selected ? "#FFF" : "#333", fontSize: 12}}>
                {
                  this.props.selected ? (
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
          this.props.selected ? (
            <div>
              <div>
              {
                Object.keys(this.props.attrs.brackets).map(key => {
                  var bracket = this.props.attrs.brackets[key];
                  var onBracketChange = (key) => {
                    return (game, format) => {
                      if(game == null) {
                        if(!this.props.attrs.brackets[key]) {
                          this.props.attrs.brackets[key] = {};
                        }
                        this.props.attrs.brackets[key].name = format.name;
                      }
                      else {
                        var prev = this.props.attrs.brackets[key] || {};
                        this.props.attrs.brackets[key] = {
                          gameObj: game,
                          format
                        };
                        this.props.attrs.brackets[key].name = prev.name;
                      }

                    }
                  }
                  if(bracket == null){
                    return "";
                  }
                  if(Object.keys(this.props.attrs.brackets).length > 1){
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
          <div className="row">
            <div className="col col-1 info-description">
              <div className="row center">
              <h3>{ tabs[this.state.item] }</h3>
              </div>
              <div style={{margin: "20px 15vw"}} className="row center">
                {
                  this.itemDescriptions()
                }
              </div>
              <div className="row col-1"></div>
              <button style={{margin: "0 auto"}} onClick={this.props.onToggle}>Create a Bracket</button>
            </div>
          </div>
        )
      }
    </div>
    );
  }
}
