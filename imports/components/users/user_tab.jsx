import React, { Component } from "react";

export default class UserTab extends Component {
  render() {
    var user = Meteor.users.findOne(this.props.id);
    return (
      <div className="row" style={{width: 150, marginRight: 10, marginBottom: 10}}>
        <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: 50, height: 50}} />
        <div className="col-1" style={{padding: 10, backgroundColor: Meteor.userId() != null && this.props.id == Meteor.userId() ? "#FF6000" : "#666" }}>
          <span>{ this.props.alias }</span>
        </div>
      </div>
    )
  }
}
