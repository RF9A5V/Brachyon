import React, { Component } from 'react'
import Modal from "react-modal";

export default class SwissMatchBlock extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className={`swiss-match ${this.props.match.played ? "complete" : ""} row center x-center`} onClick={ this.props.onSelect }>
        <div className={"swiss-player"}>{this.props.match.playerOne}</div>
        <div style={{fontSize: 30}}>VS</div>
        <div className="swiss-player">{this.props.match.playerTwo}</div>
      </div>
    );
  }
}
