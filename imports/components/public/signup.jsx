import React from 'react'
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { browserHistory, Link } from 'react-router';
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class SignUpScreen extends TrackerReact(ResponsiveComponent) {

  constructor() {
    super();
    this.state = {
      userValid: Meteor.subscribe("getUserByUsername", ""),
      value: ""
    }
  }

  onSubmit(e) {
    e.preventDefault();
    var self = this;
    if(this.refs.password.value != this.refs.confirmPassword.value) {
      return toastr.error("Passwords must match!", "Error!");
    }
    Meteor.call("users.validate", this.refs.email.value, this.refs.username.value, (err, rez) => {
      if(err) {
        return toastr.error(err.reason);
      }
      Accounts.createUser({
        email: this.refs.email.value,
        username: this.refs.username.value,
        password: this.refs.password.value,
        profile: {
          games: []
        }
      }, (err) => {
        if(err) {
          return toastr.error(err.reason);
        }
        if(this.props.onClose) {
          if(this.props.onSuccess){
            this.props.onSuccess();
          }
          this.props.onClose()
        }
      });

    })
  }

  onUsernameInputChange() {
    this.state.userValid.stop();
    this.setState({
      value: this.refs.username.value,
      userValid: Meteor.subscribe("getUserByUsername", this.refs.username.value)
    });
  }

  onEmailChange(e) {
    var value = e.target.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setState({
      emailValid: re.test(value)
    });
  }

  onPasswordChange(e) {
    var value = e.target.value;
    this.setState({
      passValid: value.length >= 5
    });
  }

  onPassConfChange(e) {
    var value = e.target.value;
    this.setState({
      passConfValid: value == this.refs.password.value
    })
  }

  renderBase(opts) {
    var icon, bgColor;
    var emailBgColor, emailIcon;
    if(this.state.userValid.ready()){
      var error = this.state.value == "" || this.state.value.length < 3 || Meteor.users.findOne({username: this.state.value}) != null;
      icon = error ? "times" : "check";
      bgColor = error ? "none" : "#00BDFF";
    }
    else {
      icon = "ellipsis-h";
    }
    emailBgColor = this.state.emailValid ? "#00BDFF" : "none";
    emailIcon = this.state.emailValid ? "check" : "times";
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center cred-form">
          <div className="row x-center" style={{marginBottom: 20}}>
            <input className={"col-1 " + opts.inputClassName} type="text" name="email" placeholder="Email" ref="email" onChange={this.onEmailChange.bind(this)} autoComplete="off" />
            <div className={"row center x-center cred-form-status " + opts.credFormSize} style={{backgroundColor: emailBgColor}}>
              <FontAwesome name={emailIcon} style={{fontSize: opts.fontSize}} />
            </div>
          </div>
          <div className="row x-center" style={{marginBottom: 20}}>
            <input className={"col-1 " + opts.inputClassName} type="text" name="username" placeholder="Username" ref="username" onChange={this.onUsernameInputChange.bind(this)} autoComplete="off" />
            <div className={"row center x-center cred-form-status " + opts.credFormSize} style={{backgroundColor: bgColor}}>
              <FontAwesome name={icon} style={{fontSize: opts.fontSize}} />
            </div>
          </div>
          <div className="row x-center" style={{marginBottom: 20}}>
            <input className={"col-1 " + opts.inputClassName} type="password" name="password" placeholder="Password" ref="password" onChange={this.onPasswordChange.bind(this)} />
            <div className={"row center x-center cred-form-status " + opts.credFormSize} style={{backgroundColor: this.state.passValid ? "#00BDFF" : "none"}}>
              <FontAwesome name={this.state.passValid ? "check" : "times"} style={{fontSize: opts.fontSize}} />
            </div>
          </div>
          <div className="row x-center" style={{marginBottom: 20}}>
            <input className={"col-1 " + opts.inputClassName} type="password" name="confirm_password" placeholder="Confirm Password" ref="confirmPassword" onChange={this.onPassConfChange.bind(this)} />
            <div className={"row center x-center cred-form-status " + opts.credFormSize} style={{backgroundColor: this.state.passConfValid ? "#00BDFF" : "none"}}>
              <FontAwesome name={this.state.passConfValid ? "check" : "times"} style={{fontSize: opts.fontSize}} />
            </div>
          </div>

          <span style={{fontSize: opts.fontSize, marginTop: opts.marginTop}}>By signing up for Brachyon, you agree to our&nbsp;
            <Link to="/terms">Terms of Service</Link>.
          </span>
          <input className={opts.inputClassName} type="submit" value="Sign Up" />
        </form>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      inputClassName: "",
      fontSize: "0.7em",
      marginTop: 20,
      credFormSize: "small"
    });
  }

  renderMobile() {
    return this.renderBase({
      inputClassName: "large-input",
      fontSize: "3rem",
      marginTop: "2rem",
      credFormSize: "large"
    });
  }

}
