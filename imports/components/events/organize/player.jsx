import React, { Component } from 'react';

export default class PlayerStub extends Component {

  constructor() {
    super();
    this.style = {
      width: 250,
      height: 75,
      backgroundColor: '#555',
      border: 'solid 1px black',
      display: 'inline-flex',
      padding: 10,
      margin: 10
    }
  }

  render() {
    return (
      <div style={this.style}>
        <img style={{height: '100%', width: 'auto'}} className="profile-photo" src="/images/profile.png" />
        <div style={{padding: 15}}>
          <span>
            {this.props.name}
          </span>
        </div>
      </div>
    );
  }
}
