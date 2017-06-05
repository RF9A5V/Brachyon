import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class DescriptionOverlay extends Component {
  render() {
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose} overlayClassName="overlay-only" className="overlay-only-modal">
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome name="times" size="2x" onClick={this.props.onClose} />
        </div>
        <div style={{marginTop: 10, maxHeight: "80vh", overflowY: "auto"}} dangerouslySetInnerHTML={{__html: this.props.description}}>
        </div>
      </Modal>
    )
  }
}
