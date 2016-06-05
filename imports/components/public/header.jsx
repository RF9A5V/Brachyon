import React from 'react';
import { render } from 'react-dom';

import App from '../app.jsx';

export default class Header extends React.Component {
  onClick(e) {
    e.preventDefault();
    Meteor.logout(() => render(<App />, document.getElementById('app')));
  }
  render() {
    var logOutLink = "";
    if(Meteor.userId()){
      logOutLink = (<a href="#" onClick={this.onClick}>Logout</a>);
    }
    return (
      <div class="row">
        {logOutLink}
      </div>
    )
  }
}
