import React from 'react';
import Modal from 'react-modal';
import LogInScreen from './login.jsx';
import SignUpScreen from './signup.jsx';
import FontAwesome from 'react-fontawesome';
import { velocity } from "velocity-react";

export default class LogInModal extends React.Component {
    constructor () {
      super();
      this.state = {
        open: false,
      }
    }

    closeModal(){
      this.setState({open: false});
    }

    render () {
      const borderHeight = 2.5;
      return (
        <div className="row">
          <button className="header-button-margin login-button" onClick={() => {
            this.setState({
              open: true,
              content: "login"
            })
          }}>Log In</button>
          <button className="header-button-margin signup-button" onClick={() => {
            this.setState({
              open: true,
              content: "signup"
            })
          }}>Sign Up</button>
          <Modal
            className="create-modal"
            overlayClassName = "credential-overlay"
            isOpen={this.state.open}
            onRequestClose={this.closeModal.bind(this)}
          >

          </Modal>
        </div>
      );
    }
  }
