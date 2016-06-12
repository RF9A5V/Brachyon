import React from 'react'
import { render } from 'react-dom';
import ShowUserScreen from '../users/show.jsx';

export default class SignUpScreen extends React.Component {
  onSubmit(e) {
    e.preventDefault();
    self = this;
    [name, email, username, password] = Object.keys(this.refs).map((value) => {return this.refs[value].value});
    console.log(name, email, username, password);
    Accounts.createUser({
      email,
      password,
      username,
      options: {
        name
      }
    }, function(err){
      if(err){
        console.log(err);
      }
      else {
        self.props.afterSubmit();
      }
    });
  }
  render() {
    return (
      <div className="col center">
        <form onSubmit={this.onSubmit.bind(this)} className="col center">
          <input type="text" name="name" placeholder="Name" ref="name" />
          <input type="text" name="email" placeholder="Email" ref="email" />
          <input type="text" name="username" placeholder="Username" ref="username" />
          <input type="password" name="password" placeholder="Password" ref="password" />
          <input type="submit" val="Submit" />
        </form>
      </div>
    )
  }
}