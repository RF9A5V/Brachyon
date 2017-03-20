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
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
            </div>
            <div className="row x-center">
              <div className="col-1"></div>
              <div className="col center" style={{width: 100}}>
                <h5 className="title" onClick={() => { this.setState({ content: "login" }) }} style={{margin: 0, marginBottom: 5, cursor: "pointer"}}>LOG IN</h5>
                {
                  this.state.content == "signup" ? (
                    <div style={{height: borderHeight}}>
                    </div>
                  ) : (
                    <div style={{width: "100%", height: borderHeight, backgroundColor: "#FF6000"}}>
                    </div>
                  )
                }
              </div>
              <div className="col-1"></div>
              <div className="col center" style={{width: 100}}>
                <h5 className="title" onClick={() => { this.setState({ content: "signup" }) }} style={{margin: 0, marginBottom: 5, cursor: "pointer"}}>SIGN UP</h5>
                {
                  this.state.content == "login" ? (
                    <div style={{height: borderHeight}}>
                    </div>
                  ) : (
                    <div style={{width: "100%", height: borderHeight, backgroundColor: "#FF6000"}}>
                    </div>
                  )
                }
              </div>
              <div className="col-1"></div>
            </div>
            <div className="row col-1 x-center center">
              {
                this.state.content == "login" ? (
                  <LogInScreen onClose={this.closeModal.bind(this)} />
                ) : (
                  <SignUpScreen onClose={this.closeModal.bind(this)} />
                )
              }
            </div>
          </Modal>
        </div>
      );
    }
  }
