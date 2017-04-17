import React from "react";
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

  renderBase(ops) {
    const borderHeight = 2.5;
    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={this.props.onClose}
        className={ops.modalClass}
        overlayClassName={ops.overlayClass}
        shouldCloseOnOverlayClick={ops.closesOnOverlayClick}
      >
        <div className="col" style={{height: "100%"}}>
          <div className="row justify-end col-1">
            <FontAwesome onClick={this.props.onClose} name="times" style={{fontSize: ops.iconSize}}/>
          </div>
          <div>
            <div className="row x-center" style={{marginBottom: 20}}>
              <div className="col-1"></div>
              <div className="col center">
                <h5 className="title" onClick={() => { this.setState({ content: "login" }) }} style={{margin: 0, marginBottom: 5, cursor: "pointer", fontSize: ops.fontSize}}>LOG IN</h5>
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
              <div className="col center">
                <h5 className="title" onClick={() => { this.setState({ content: "signup" }) }} style={{margin: 0, marginBottom: 5, cursor: "pointer", fontSize: ops.fontSize}}>SIGN UP</h5>
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
            <div className="row x-center center">
              {
                this.state.content == "login" ? (
                  <LogInScreen onClose={this.props.onClose} onSuccess={this.props.onSuccess} />
                ) : (
                  <SignUpScreen onClose={this.props.onClose} onSuccess={this.props.onSuccess} />
                )
              }
            </div>
          </div>
          <div className="col-1">
          </div>
        </div>
      </Modal>
    )
  }

  renderDesktop() {
    return this.renderBase({
      modalClass: "create-modal",
      overlayClass: "credential-overlay",
      closesOnOverlayClick: true,
      iconSize: "2em",
      fontSize: "1em"
    });
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      closesOnOverlayClick: false,
      iconSize: "8rem",
      fontSize: "6rem"
    });
  }
}
