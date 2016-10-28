import React from 'react';
import Modal from 'react-modal';
import LogInScreen from './login.jsx';
import FontAwesome from 'react-fontawesome';
import { velocity } from "velocity-react";

export default class LogInModal extends React.Component {
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
          <button className="header-button-margin login-button" onClick={this.openModal.bind(this)}>Log In</button>
          <Modal
            className = "create-modal"
            overlayClassName = "credential-overlay"
            isOpen={this.state.open}
            onRequestClose={this.closeModal.bind(this)}
          >
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
            </div>
            <h1 style={{textAlign: 'center', marginBottom: 0}}>Log In</h1>
            <LogInScreen />
          </Modal>
        </div>
      );
    }
  }
