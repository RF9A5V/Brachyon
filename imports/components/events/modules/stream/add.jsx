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
      <div className="col" style={{alignItems: "flex-start"}}>
        <h5>Stream Name</h5>
        <input ref="twitchStreamName" placeholder="Copy and paste your Twitch IFRAME tag here!" defaultValue={(Events.findOne().twitchStream || {}).name} />
        <a href="#">How do I do this?</a>
        <div className="row center x-center" style={{marginTop: 10}}>
          <button onClick={this.onStreamNameSave.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
