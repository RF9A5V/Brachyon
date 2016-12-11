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
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
            </div>
            <div className="row center">
              <h5 onClick={() => { this.setState({ content: "login" }) }} style={{color: this.state.content == "login" ? "#00BDFF" : "white", cursor: "pointer"}}>LOG IN</h5>
              <h5 style={{marginLeft: 10, marginRight: 10}}>/</h5>
              <h5 onClick={() => { this.setState({ content: "signup" }) }} style={{color: this.state.content == "signup" ? "#00BDFF" : "white", cursor: "pointer"}}>SIGN UP</h5>
            </div>
            <div className="row col-1 x-center center">
              {
                this.state.content == "login" ? (
                  <LogInScreen />
                ) : (
                  <SignUpScreen />
                )
              }
            </div>
          </Modal>
        </div>
      );
    }
  }
