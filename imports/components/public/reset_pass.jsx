import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class ResetPassScreen extends Component {

  onSubmit(e) {
    e.preventDefault();
    Accounts.resetPassword(this.props.params.token, this.refs.pass.value, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully reset your password!");
        browserHistory.push("/");
      }
    });
  }

  render() {
    return (
      <div className="col center x-center col-1">
        <span style={{marginBottom: 10}}>Enter in your password and confirm it!</span>
        <form className="col center x-center" onSubmit={this.onSubmit.bind(this)}>
          <input style={{margin: 0, marginBottom: 10}} type="password" placeholder="Password" ref="pass" />
          <input style={{margin: 0, marginBottom: 10}} type="password" placeholder="Confirm Password" ref="passConf" />
          <input style={{marginRight: 0}} type="submit" />
        </form>
      </div>
    )
  }
}
