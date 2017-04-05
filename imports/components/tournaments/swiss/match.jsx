import React, { Component } from 'react'
import Modal from "react-modal";

export default class RoundMatchBlock extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    var match = Matches.findOne(this.props.match.id)
    return (
      <div className={`swiss-match ${this.props.match.played ? "complete" : ""} row center x-center`} onClick={ this.props.onSelect }style={{width:"300px", marginRight:"20px"}}>
        <div className={`swiss-player ${(match.players[0].score>match.players[1].score&&this.props.match.played)?("winner"):("")} ${match.players[0].alias.length > 15?("marquee"):("")}`}>
          {match.players[0].alias}</div>
        <div style={{fontSize: 30}}>VS</div>
        <div className={`swiss-player ${(match.players[0].score<match.players[1].score&&this.props.match.played)?("winner"):("")} ${match.players[1].alias.length > 15?("marquee"):("")}`}>
          {match.players[1].alias}</div>
      </div>
    );
  }
}
