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
      <div className="row center x-center col-1">
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="password" placeholder="Password" ref="pass" />
          <input type="password" placeholder="Confirm Password" ref="passConf" />
          <input type="submit" />
        </form>
      </div>
    )
  }
}
