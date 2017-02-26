import React, {Component} from "react";
import { browserHistory, Link } from 'react-router';

export default class LogInScreen extends Component {

  onSubmit(e) {
    e.preventDefault();
    self = this;
    [token, password] = Object.keys(this.refs).map((value) => { return this.refs[value].value });
    Meteor.loginWithPassword(token, password, function(err){
      if(err){

        toastr.error("Username and password combination not found!", "Error!");
      }
      else {
        toastr.success("Successfully logged in!", "Success!");
        browserHistory.push("/discover");
      }
    })
  }

  render(){
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center cred-form">
          <input type="text" name="email" placeholder="Email or Username" ref="token" />
          <input type="password" name="password" placeholder="Password" ref="password" />
          <Link to="/forgot_pw" style={{fontSize: 12, marginTop: 10}}>
            Forgot Password?
          </Link>
          <input type="submit" value="Log In" style={{marginTop: 10}} />
        </form>
      </div>
    );
  }
}
