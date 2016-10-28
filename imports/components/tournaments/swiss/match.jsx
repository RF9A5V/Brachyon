import React, { Component } from 'react'
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class SwissMatchBlock extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
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


  validateData(i){
    var p1 = parseInt(this.refs.p1win.value);
    var p2 = parseInt(this.refs.p2win.value);
    var ties = parseInt(this.refs.ties.value);
    console.log(p1 + " " + p2 + " " + ties);
    if(p1 == null || isNaN(p1)) {
      throw new Error("Player one wins can't be null!");
    }
    if(p2 == null || isNaN(p2)) {
      throw new Error("Player two wins can't be null!");
    }
    if(ties == null || isNaN(ties)) {
      ties = 0;
    }
    this.props.declareWinner(3, p1, p2, ties, i);
    this.closeModal();
  }

  render(){
    return(
    <div>
      <div className="col center" style={{paddingLeft: "20px"}}>
        <div onClick={ (this.props.match.played == false && this.props.page == this.props.rounds.length-1) ? (() => { this.setState({open: true}) }):( () => {} ) }>{this.props.match.playerOne}</div>
        <div>VS.</div>
        <div onClick={ (this.props.match.played == false && this.props.page == this.props.rounds.length-1) ? (() => { this.setState({open: true}) }):( () => {} ) }>{this.props.match.playerTwo}</div>
      </div>

      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
        <div className="col" style={{height: "100%"}}>
          <div className="self-end">
            <FontAwesome name="times" onClick={() => { this.setState({open: false, playerone: 0, playertwo: 0, ties: 0}) }} />
          </div>
          <h3 className="col-1 center">Set the Winner</h3>
          <div className="row flex-padaround col-1">
            <div className="col">
              <div className="participant-active">{this.props.match.playerOne}</div>
              <input type="number" ref="p1win" onChange={(evt) => this.getValue(evt, 0).bind(this)}/>
            </div>
            <div className="col">
              <div className="participant-active">{this.props.match.playerTwo}</div>
              <input type="number" ref="p2win" onChange={(evt) => this.getValue(evt, 1).bind(this)}/>
            </div>
          </div>
          <div className="col">
            <span>Ties</span>
            <input type="number" ref="ties" onChange={(evt) => this.getValue(evt, 2).bind(this)}/>
          </div>
          <button onClick={() => {this.validateData(this.props.i).bind(this)}}>Update Match</button>
        </div>
      </Modal>
    </div>
    );
  }
}
