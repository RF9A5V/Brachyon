import React from 'react';

export default class Header extends React.Component {
  onClick(e) {
    e.preventDefault();
    Meteor.logout();
  }
  render() {
    var logOutLink = "";
    if(Meteor.userId()){
      logOutLink = (<a href="#" onClick={this.onClick}>Logout</a>);
    }
    return (
      <header class="row">
        {logOutLink}
      </header>
    )
  }
}
