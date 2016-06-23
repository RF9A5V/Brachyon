import React, {Component} from 'react';

export default class LogInScreen extends Component {

  onSubmit(e) {
    e.preventDefault();
    self = this;
    [token, password] = Object.keys(this.refs).map((value) => { return this.refs[value].value });
    Meteor.loginWithPassword(token, password, function(err){
      if(err){
        console.log(err);
      }
      else {
        browserHistory.push('/events/discover');
      }
    })
  }

  render(){
    return (
      <div className="col center modal-pad">
        <form onSubmit={this.onSubmit.bind(this)} className="col center">
          <input type="text" name="email" placeholder="Email or Username" ref="token" />
          <input type="password" name="password" placeholder="Password" ref="password" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
