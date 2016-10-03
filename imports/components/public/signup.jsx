import React from 'react'
import { render } from 'react-dom';
import ShowUserScreen from '../users/show.jsx';
import { browserHistory, Link } from 'react-router';


export default class SignUpScreen extends React.Component {
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
  render() {
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center">
          <input type="text" name="username" placeholder="Username" ref="username" />
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
