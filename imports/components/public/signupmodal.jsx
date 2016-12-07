import React from 'react';
import Modal from 'react-modal';
import SignUpScreen from './signup.jsx';
import FontAwesome from 'react-fontawesome';
import { VelocityComponent } from "velocity-react";

export default class SignUpModal extends React.Component {
    constructor () {
      super();
      this.state = {
        open: false,
        isAnim: false
      }
    }

    openModal(){
      this.setState({
        open: true,
        isAnim: true
      });
    }

    closeModal(){
      this.setState({open: false});
    }

    render () {
      return (
        <div>
          <Modal
            className = "create-modal"
            overlayClassName = "credential-overlay"
            isOpen={this.state.open}
            onRequestClose={this.closeModal.bind(this)}
          >
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
            </div>
            <h1 style={{textAlign: 'center', marginBottom: 0}}>Sign Up</h1>
            <SignUpScreen onsubmit={this.closeModal.bind(this)} />
          </Modal>
        </div>
      );
    }
  }
