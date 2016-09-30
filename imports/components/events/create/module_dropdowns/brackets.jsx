import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketForm from "../../brackets/form.jsx";

import Games from "/imports/api/games/games.js";

export default class BracketsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bracketCount: 1,
      brackets: [1]
    };
  }

  value() {
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
              return (
                <div className="game-bracket-container">
                  <BracketForm key={key} ref={key} deletable={true} cb={(e) => { this.state.brackets[key] = null; this.state.bracketCount--; this.forceUpdate() }} />
                </div>
              );
            }
            return (
              <div className="game-bracket-container">
                <BracketForm key={key} ref={key} />
              </div>
            );
          })
        }
        {
          // this.state.bracketCount < 15 ? (
          //   <button onClick={(e) => { e.preventDefault(); this.state.bracketCount++; this.state.brackets.push(1); this.forceUpdate() }}>Add A Bracket</button>
          // ) : (
          //   ""
          // )
        }
      </div>
    )
  }
}
