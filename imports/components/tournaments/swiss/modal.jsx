import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class SwissModal extends Component {

  constructor(props) {
    super(props);
  }

  validateData(){
    var p1 = parseInt(this.refs.p1win.value);
    var p2 = parseInt(this.refs.p2win.value);
    var ties = parseInt(this.refs.ties.value);
    if(isNaN(p1) || p1 < 0) {
      throw new Error("Player one wins can't be null!");
    }
    if(isNaN(p2) || p2 < 0) {
      throw new Error("Player two wins can't be null!");
    }
    if(isNaN(ties) || ties < 0) {
      ties = 0;
    }
    this.props.declareWinner(3, p1, p2, ties, this.props.i);
    this.closeModal();
  }

  closeModal() {
    this.props.onRequestClose();
  }

  render() {
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.closeModal.bind(this)}>
        {
          this.props.match == null ? (
            ""
          ) : (
            <div className="col" style={{height: "100%"}}>
              <div className="self-end">
                <FontAwesome name="times" onClick={this.closeModal.bind(this)} />
              </div>
              <h3 className="col-1 center">Set the Winner</h3>
              <div className="row flex-padaround col-1">
                <div className="col">
                  <div className="participant-active">{this.props.match.playerOne}</div>
                  <input type="number" ref="p1win"/>
                </div>
                <div className="col">
                  <div className="participant-active">{this.props.match.playerTwo}</div>
                  <input type="number" ref="p2win"/>
                </div>
              </div>
              <div className="col">
                <span>Ties</span>
                <input type="number" ref="ties"/>
              </div>
              <button onClick={() => { this.validateData() }}>Update Match</button>
            </div>
          )
        }
      </Modal>
    )
  }
}
