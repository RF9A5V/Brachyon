import React from 'react'
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { render } from 'react-dom';
import ShowUserScreen from '../users/show.jsx';
import { browserHistory, Link } from 'react-router';
import FontAwesome from "react-fontawesome";

export default class SignUpScreen extends TrackerReact(React.Component) {

  constructor() {
    super();
    this.state = {
      userValid: Meteor.subscribe("getUserByUsername", ""),
      value: ""
    }
  }

  onSubmit(e) {
    e.preventDefault();
    self = this;
    Meteor.call("users.create", this.refs.name.value, this.refs.email.value, this.refs.username.value, this.refs.password.value, function(err, rez) {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else if (rez == null){
        toastr.error("Issue generating login token.", "Call an Admin!");
      }
      else {
        Meteor.loginWithToken(rez.token);
        toastr.success("Successfully created your account!", "Success!");
        browserHistory.push('/events/discover');
      }
    });
  }

  onUsernameInputChange() {
    this.state.userValid.stop();
    this.setState({
      value: this.refs.username.value,
      userValid: Meteor.subscribe("getUserByUsername", this.refs.username.value)
    });
  }

  render() {
    var user;
    var bgColor;
    var icon;
    if(this.state.userValid.ready()){
      user = this.state.value == "" || this.state.value.length < 3 ? true : Meteor.users.findOne({username: this.state.value})
      bgColor = user ? "#FF1951" : "#00BDFF";
      icon = user ? "times" : "check";
    }
    else {
      bgColor = "#CCC114";
      icon = "ellipsis-h";
    }
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center">
          <div className="row x-center">
            <input className="col-1" type="text" name="username" placeholder="Username" ref="username" onChange={this.onUsernameInputChange.bind(this)} />
            <div className="row center x-center" style={{marginRight: 10, width: 39, height: 39, backgroundColor: bgColor}}>
              <FontAwesome name={icon} />
            </div>
          </div>
          <input type="text" name="name" placeholder="Name" ref="name" />
          <input type="text" name="email" placeholder="Email" ref="email" />
          <input type="password" name="password" placeholder="Password" ref="password" />
          <span style={{fontSize: "0.7em", marginBottom: 10}}>By signing up for Brachyon, you agree to our&nbsp;
            <Link to="/terms">Terms of Service</Link>.
          </span>
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    )
  }
}
