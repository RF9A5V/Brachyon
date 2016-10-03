import React, { Component } from "react";
import Modal from "react-modal";

export default class CFModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    }
  }

componentWillReceiveProps(next) {
  this.setState({
    open: next.open
  })
}

  render() {
    return (
      <div>
        <Modal isOpen={this.state.open} onRequestClose={this.props.close}>
          test a test
        </Modal>
      </div>
    )
  }
}
