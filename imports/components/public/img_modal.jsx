import React, { Component } from 'react';
import Modal from 'react-modal';

export default class ImageModal extends Component {

  componentWillMount(){
    this.setState({
      open: this.props.open
    })
  }

  componentWillReceiveProps(next){
    this.setState({
      open: next.open
    })
  }

  closeModal() {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="div-pad">
            <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
          </div>
          { this.props.children }
        </Modal>
      </div>
    );
  }
}
