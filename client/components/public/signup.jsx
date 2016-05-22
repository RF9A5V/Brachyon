import React from 'react'
import { render } from 'react-dom';
import ShowUserScreen from '../users/show.jsx';

export default class SignUpScreen extends React.Component {
  onSubmit(e) {
    e.preventDefault();
    email = document.querySelector('[name="email"]').value
    password = document.querySelector('[name="password"]').value
    username = document.querySelector('[name="username"]').value
    name = document.querySelector('[name="name"]').value
    Accounts.createUser({
      email,
      password,
      username,
      options: {
        name
      }
    });
    render(<ShowUserScreen />, document.getElementById('app'));
  }
  render() {
    return (
      <div className="col center">
        <form onSubmit={this.onSubmit} className="col center">
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="email" placeholder="Email" />
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <input type="submit" val="Submit" />
        </form>
      </div>
    )
  }
}
