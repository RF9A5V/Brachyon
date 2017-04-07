import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import LogInScreen from './login.jsx';
import SignUpScreen from './signup.jsx';

export default class RegModal extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      content: "login"
    }
  }

  componentWillReceiveProps(next) {
    if(next.content) {
      this.setState({
        content: next.content
      })
    }
  }

  render() {
    const borderHeight = 2.5;
    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={this.props.onClose}
        className="create-modal"
        overlayClassName = "credential-overlay"
      >
        <div className="row justify-end">
          <FontAwesome onClick={this.props.onClose} name="times" size="2x" className="close-modal"/>
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
              <LogInScreen onClose={this.props.onClose} />
            ) : (
              <SignUpScreen onClose={this.props.onClose} />
            )
          }
        </div>
      </Modal>
    )
  }
}
