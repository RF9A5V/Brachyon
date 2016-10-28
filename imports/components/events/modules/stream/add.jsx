import React, { Component } from 'react';

export default class AddStream extends Component{

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onStreamNameSave(){
    Meteor.call("events.updateTwitchStream", this.state.id, this.refs.twitchStreamName.value, (err)=> {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated Twitch iFrame!", "Success!");
      }
    })
  }


  render(){
    return(
      <div>
        <h2>Stream</h2>
        <input type="text" ref="twitchStreamName" placeholder="Stream iFrame tag"></input>
        <button onClick={this.onStreamNameSave.bind(this)}>Save</button>
      </div>
    )
  }
}
