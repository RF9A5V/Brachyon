import React, { Component } from 'react'
import Modal from "react-modal";

export default class SwissMatchBlock extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className={`swiss-match ${this.props.match.played ? "complete" : ""} row center x-center`} onClick={ this.props.onSelect }style={{width:"300px", marginRight:"20px"}}>
        <div className={`swiss-player ${(this.props.match.scoreOne > this.props.match.scoreTwo && this.props.match.played) ? ("winner") : ("")} ${this.props.match.playerOne.length > 15?("marquee"):("")}`}>
          {this.props.match.playerOne}</div>
        <div style={{fontSize: 30}}>VS</div>
        <div className={`swiss-player ${(this.props.match.scoreOne < this.props.match.scoreTwo && this.props.match.played) ? ("winner") : ("")} ${this.props.match.playerTwo.length > 15?("marquee"):("")}`}>
          {this.props.match.playerTwo}</div>
      </div>
    );
  }
}
