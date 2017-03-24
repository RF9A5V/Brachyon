import React, { Component } from 'react';

export default class AddStream extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  value() {
    return this.refs.twitchStreamName.value
  }

  render(){
    return(
      <div className="col">
        <div className="row center x-center">
          <span>https://twitch.tv/</span>
          <input ref="twitchStreamName" placeholder="Twitch Username" defaultValue={(Events.findOne().stream || {}).twitchStream.name} />
        </div>
      </div>
    )
  }
}
