import React from 'react';
import Modal from 'react-modal';
import SignUpScreen from './signup.jsx';

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
          <button className="head-margin" onClick={this.openModal.bind(this)}>Signup</button>
          <Modal
            className = "cred-modal"
            overlayClassName = "cred-overlay"
            isOpen={this.state.open}>
            <div className="div-pad">
              <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
            </div>
            <h1 style={{textAlign: 'center'}}>Sign Up</h1>
            <SignUpScreen />
          </Modal>
        </div>
      );
    }
  }
