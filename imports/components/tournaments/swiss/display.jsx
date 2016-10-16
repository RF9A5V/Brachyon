import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {

  constructor(props)
  {
    super(props);
    var page = this.props.rounds.length-1;
    var num = 0;
    for (var x = 0; x < this.props.rounds[page].matches.length; x++)
    {
      if (this.props.rounds[page].matches[x].winner != null)
        num++;
    }
    this.state = {
      page: page,
      wcount: num
    }
  }

  declareWinner(pos, score, matchnumber)
  {
      Meteor.call("events.update_match", this.props.id, this.state.page, matchnumber, score, pos, function(err) {
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
  }

  newRound() {
    if (!(this.state.wcount == this.props.rounds[this.state.page].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.props.rounds[this.state.page].matches.length + "!", "Error!");
    Meteor.call("events.update_round", this.props.id, this.state.page, function(err) {
      if(err){
        console.log(err);
        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
        var page = this.state.page+1;
        this.setState({wcount: 0, page: page});
      }
    });
  }

  render() {

    return (
      <div className="col">
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
                <div className="col center" style={{paddingLeft: "20px"}}>
                  <div onClick={ (match.winner == null && this.state.page == this.props.rounds.length-1) ? (() => { this.declareWinner(0, 3, i).bind(this) }):( () => {} ) }>{match.playerOne}</div>
                  <div>VS.</div>
                  <div onClick={ (match.winner == null && this.state.page == this.props.rounds.length-1) ? (() => { this.declareWinner(1, 3, i).bind(this) }):( () => {} ) }>{match.playerTwo}</div>
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
