import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

import Games from "/imports/api/games/games.js";

export default class BracketsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0,
      bracketCount: 1,
      brackets: [1]
    };
  }

  value() {
    return Object.keys(this.refs).map((key, index) => {
      try {
        return this.refs[key].value();
      }
      catch(error) {
        toastr.error("All fields in the Game Bracket form have to be complete!", "Error!");
        throw error;
      }
    });
  }

  itemTabs() {
    var values = ["Bracket"];
    return (
      <div className="info-title-container">
        {
          values.map((value, i) => {
            return (
              <div className={`info-title ${this.state.item == i ? "active" : ""}`} onClick={() => { this.setState({ item: i }) }}>
                { value }
              </div>
            )
          })
        }
      </div>
    )
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
      <div className="col" style={this.props.style}>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{cursor: "pointer", backgroundColor: "#333", width: 100, height: 30}} onClick={this.props.onToggle}>
            <div className="row center x-center" style={{backgroundColor: this.props.selected ? "#FF6000" : "white", width: 45, height: 20, position: "relative", left: this.props.selected ? 50 : 5}}>
              <span style={{color: "#333"}}>
                {
                  this.props.selected ? (
                    "On"
                  ) : (
                    "Off"
                  )
                }
              </span>
            </div>
          </div>
        </div>
        {
          this.props.selected ? (
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
          ) : (
          <div className="row">
            {
              this.itemTabs()
            }
            <div className="col col-1 info-description">
              <div className="row center">
              <h3>{ tabs[this.state.item] }</h3>
              </div>
              {
                this.itemDescriptions()
              }
            </div>
          </div>
        )
      }
    </div>
    );
  }
}
