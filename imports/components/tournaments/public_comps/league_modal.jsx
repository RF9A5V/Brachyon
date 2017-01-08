import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal"

export default class LeagueModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  closeModal() {
    this.props.close();
  }

  boardFormatting(ldrboard) {
    var totalPoints = Object.keys(ldrboard).length;
    return (
      <div style={{maxHeight: 300, overflowY: "auto"}}>
        <div className="row">
          <div className="col-1">
            Position
          </div>
          <div className="col-1">
            Username
          </div>
          <div className="col-1">
            Points
          </div>
          <div className="col-1">
            Bonus
          </div>
        </div>
        {
          Object.keys(ldrboard).map((user, i) => {
            return (
              <div className="row x-center" style={{marginBottom: 10}}>
                <div className="col-1">
                  { ldrboard[user] }
                </div>
                <div className="col-1">
                  { user }
                </div>
                <div className="col-1">
                  { totalPoints - i  }
                </div>
                <div className="col-1">
                  <input type="text" style={{width: "100%", margin: 0, fontSize: 12}} onChange={(e) => {
                    if(isNaN(e.target.value)) {
                      e.target.value = e.target.value.slice(0, e.target.value.length - 1)
                    } }} onKeyPress={(e) => {
                      if(e.key == "Enter") {
                        e.target.blur();
                      }
                    }} onBlur={(e) => {
                      this.state.participants[user] = parseInt(e.target.value);
                    }}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }

  singleElimLeaderboard() {
    var ldrboard = {};
    var participants = {};
    var userCount = 1;
    var roundobj = Brackets.findOne();
    var finals = roundobj.rounds[roundobj.rounds.length - 1].pop()[0];
    roundobj.rounds[roundobj.rounds.length - 1].push([finals]);
    var singleElimBracket = roundobj.rounds[roundobj.rounds.length - 1];
    singleElimBracket.reverse().forEach(round => {
      round.forEach(match => {
        if(ldrboard[match.winner] == null) {
          ldrboard[match.winner] = userCount ++;
          participants[match.winner] = 0;
        }
        var loser = match.winner == match.playerOne ? match.playerTwo : match.playerOne;
        if(ldrboard[loser] == null) {
          ldrboard[loser] = userCount ++;
          participants[loser] = 0;
        }
      });
    });
    this.state.participants = participants;
    return this.boardFormatting(ldrboard);
  }

  doubleElimLeaderboard() {
    var ldrboard = {};
    var participants = {};
    var userCount = 1;
    var roundobj = Brackets.findOne();
    // Check to see if bracket has played to completion.
    var finalSet = roundobj.rounds[roundobj.rounds.length - 1];
    var finalOne = finalSet[0][0];
    var finalTwo = finalSet[1][0];
    // If the first match has a winner and nobody is playing in the second match, the bracket is decided.
    // If the second match has a winner, the bracket is decided.
    var losersBracket = roundobj.rounds[1];
    losersBracket = losersBracket.concat(finalSet).reverse();
    losersBracket.forEach(round => {
      round.forEach(match => {
        if(match.winner == null) {
          return;
        }
        if(ldrboard[match.winner] == null) {
          ldrboard[match.winner] = userCount ++;
          participants[match.winner] = 0;
        }
        var loser = match.winner == match.playerOne ? match.playerTwo : match.playerOne;
        if(ldrboard[loser] == null) {
          ldrboard[loser] = userCount ++;
          participants[loser] = 0;
        }
      })
    });
    this.state.participants = participants;
    return this.boardFormatting(ldrboard);
  }

  boardType() {
    var bracketIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
    switch(Instances.findOne().brackets[bracketIndex].format.baseFormat) {
      case "single_elim":
        return this.singleElimLeaderboard();
      case "double_elim":
        return this.doubleElimLeaderboard();
      default:
        return (<div></div>)
    }
  }

  render() {
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.closeModal.bind(this)}>
        <div className="row">
          <div className="col-1"></div>
          <FontAwesome name="times" size="2x" onClick={this.closeModal.bind(this)} />
        </div>
        <div className="row center" style={{marginBottom: 10}}>
          <h5>Close Your Bracket</h5>
        </div>
        { this.boardType() }
        <div className="row center">
          <button onClick={this.closeModal.bind(this)} style={{marginRight: 20}}>Cancel</button>
          <button onClick={ () => { console.log(this.state.participants) } }>Finalize</button>
        </div>
      </Modal>
    )
  }
}
