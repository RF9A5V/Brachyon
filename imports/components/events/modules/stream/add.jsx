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
      <div className="col" style={{width: "50%", minWidth: 300, margin: "0 auto"}}>
        <h4>Stream</h4>
        <div className="submodule-bg">
          <div className="row center x-center">
            <span>https://twitch.tv/</span>
            <input ref="twitchStreamName" placeholder="Twitch Username" defaultValue={(Events.findOne().twitchStream || {}).name} />
          </div>
          <div className="row center x-center">
            <button onClick={this.onStreamNameSave.bind(this)}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}
