import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {

  constructor(props)
  {
    super(props);
    var page = this.props.rounds.length-1;
    var num = 0;
    for (var x = 0; x < this.props.rounds[page].matches.length; x++)
    {
      if (this.props.rounds[page].matches[x].played != false)
        num++;
    }
    this.state = {
      page: page,
      wcount: num,
      open: false,
      playerone: 0,
      playertwo: 0,
      ties: 0
    }
  }

  openModal() {
    this.setState({
      open: true,
      playerone: 0,
      playertwo: 0,
      ties: 0
    });
  }

  closeModal() {
    this.setState({
      open: false,
      playerone: 0,
      playertwo: 0,
      ties: 0
    });
  }

  declareWinner(score, win1, win2, ties, matchnumber)
  {
      Meteor.call("events.update_match", this.props.id, this.state.page, matchnumber, score, win1, win2, function(err) {
        if(err){
          console.log(err);
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          var wcount = this.state.wcount+1;
          toastr.success("Players " + wcount + " advanced to next round!", "Success!");
          this.setState({wcount: wcount});
        }
      });
      var wcount = this.state.wcount+1;
      this.setState({wcount: wcount});
  }

  newRound() {
    if (!(this.state.wcount == this.props.rounds[this.state.page].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.props.rounds[this.state.page].matches.length + "!", "Error!");
    Meteor.call("events.update_round", this.props.id, this.state.page, 3, function(err) {
      if(err){
        console.log(err);
        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
      }
    });
    var page = this.state.page+1;
    this.setState({wcount: 0, page: page});
  }

  getValue(e, k)
  {
    var val = parseInt(e);
    if (k == 0)
      this.setState({playerOne: val});
    else if (k == 1)
      this.setState({playerTwo: val});
    else
      this.setState({ties: val});
  }

  validateData(i){
    console.log("Testing here");
    if(this.state.playerOne == null || this.state.playerOne == "") {
      throw new Error("Bracket Name can't be null!");
    }
    if(this.state.playerTwo == null || this.state.playerTwo == "") {
      throw new Error("Bracket Name can't be null!");
    }
    if(this.state.ties == null || this.state.ties == "") {
      this.setState({ties: 0});
    }
    console.log("Does this even happen?");
    this.declareWinner(3, this.state.playerone, this.state.playertwo, this.state.ties, i);
    this.closeModal();
  }

  render() {

    return (
      <div className="col">
        <div className="center">
        <h2>{"Round " + (this.state.page+1)}</h2>
        </div>
        <div className="row flex-pad">
          <div>
          {
            this.state.page > 0 ? (
              <button onClick={ () => {this.setState({page: this.state.page-1})} }>{"<-- Prev"}</button>
            ):("")
          }
          </div>
          <div>
          {
            this.state.page < this.props.rounds.length-1 ? (
              <button onClick={ () => {this.setState({page: this.state.page+1})} } >{"Next -->"}</button>
            ):("")
          }
          </div>
        </div>
        <div className="row">
          <div className="col">
          {
              this.props.rounds[this.state.page].players.map((playerObj, i) => {
                return (
                  <div>{playerObj.name + " S: " + playerObj.score + " W: " + playerObj.wins + " L: " + playerObj.losses}</div>
                );
              })
          }
          </div>
          <div className="row">
          {
            this.props.rounds[this.state.page].matches.map((match, i) => {
              return(
              <div>
                <div className="col center" style={{paddingLeft: "20px"}}>
                  <div onClick={ (match.played == false && this.state.page == this.props.rounds.length-1) ? (() => { this.setState({open: true}) }):( () => {} ) }>{match.playerOne}</div>
                  <div>VS.</div>
                  <div onClick={ (match.played == false && this.state.page == this.props.rounds.length-1) ? (() => { this.setState({open: true}) }):( () => {} ) }>{match.playerTwo}</div>
                </div>

                <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
                  <div className="col" style={{height: "100%"}}>
                    <div className="self-end">
                      <FontAwesome name="times" onClick={() => { this.setState({open: false, playerone: 0, playertwo: 0, ties: 0}) }} />
                    </div>
                    <h3 className="col-1 center">Set the Winner</h3>
                    <div className="row flex-padaround col-1">
                      <div className="col">
                        <div className="participant-active">{match.playerOne}</div>
                        <input type="number" onChange={(evt) => this.getValue(evt, 0).bind(this)}/>
                      </div>
                      <div className="col">
                        <div className="participant-active">{match.playerTwo}</div>
                        <input type="number" onChange={(evt) => this.getValue(evt, 1).bind(this)}/>
                      </div>
                    </div>
                    <div className="col">
                      <span>Ties</span>
                      <input type="number" onChange={(evt) => this.getValue(evt, 2).bind(this)}/>
                    </div>
                    <button onClick={() => {this.validateData(i).bind(this)}}>Update Match</button>
                  </div>
                </Modal>
              </div>
              );
            })
          }
          </div>
          <div>
          {
            (this.state.page == this.props.rounds.length-1 && this.state.wcount == this.props.rounds[this.state.page].matches.length) ? (
              <button onClick={ () => {this.newRound().bind(this)} }>
              Advance Round
              </button>
            ):
            ( "" )
          }
          </div>
        </div>
      </div>
    )
  }
}
