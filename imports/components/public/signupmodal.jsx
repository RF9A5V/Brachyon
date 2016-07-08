import React from 'react';
import Modal from 'react-modal';
import SignUpScreen from './signup.jsx';
import FontAwesome from 'react-fontawesome';

export default class SignUpModal extends React.Component {
    constructor () {
      super();
      this.state = {
        open: false,
      }
    }

    openModal(){
      this.setState({open: true});
    }

    closeModal(){
      this.setState({open: false});
    }

    render () {
      return (
        <div>
          <button className="head-margin signup-button" onClick={this.openModal.bind(this)}>Sign Up</button>
          <Modal
            className = "create-modal"
            overlayClassName = "cred-overlay"
            isOpen={this.state.open}>
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="3x" className="close-modal"/>
            </div>
            <h1 style={{textAlign: 'center'}}>Sign Up</h1>
            <SignUpScreen onsubmit={this.closeModal.bind(this)} />
          </Modal>
        </div>
      );
    }
  }
