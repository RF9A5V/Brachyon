import React from "react";
import { browserHistory, Link } from 'react-router';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class LogInScreen extends ResponsiveComponent {

  onSubmit(e) {
    e.preventDefault();
    self = this;
    [token, password] = Object.keys(this.refs).map((value) => { return this.refs[value].value });
    Meteor.loginWithPassword(token, password, (err, data) => {
      if(err){
        toastr.error("Username and password combination not found!", "Error!");
      }
      else {
        toastr.success("Successfully logged in!", "Success!");
        if(this.props.onSuccess) {
          this.props.onSuccess();
        }
        else {
          browserHistory.push("/discover");
        }
      }
    })
  }

  renderBase(ops) {
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center cred-form">
          <input className={ops.inputClassName} type="text" name="email" placeholder="Email or Username" ref="token" />
          <div style={{height: 20}}></div>
          <input className={ops.inputClassName} type="password" name="password" placeholder="Password" ref="password" />
          <a href="/forgot_pw" style={{fontSize: ops.fontSize, marginTop: ops.marginTop}} onClick={(e) => {
            e.preventDefault();
            this.props.onClose();
            browserHistory.push("/forgot_pw")
          }}>Forgot Password?</a>
          <input className={ops.inputClassName} type="submit" value="Log In" style={{marginTop: ops.marginTop}} />
        </form>
      </div>
    )
  }

  renderMobile(){
    return this.renderBase({
      inputClassName: "large-input",
      fontSize: "3rem",
      marginTop: "2rem"
    });
  }

  renderDesktop() {
    return this.renderBase({
      inputClassName: "std-input",
      fontSize: "12px",
      marginTop: "10px"
    });
  }

}
