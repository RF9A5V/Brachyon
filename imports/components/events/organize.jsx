import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import PlayerStub from './organize/player.jsx';
import EventTypeForm from './organize/type_form.jsx';

export default class OrganizeEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;
    this.setState({
      event: Meteor.subscribe('event', self.props.params.eventId)
    })
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  image() {
    return Images.find().fetch()[0];
  }

  participants() {
    if(!this.event() || !this.event().participants){
      return [];
    }
    return this.event().participants;
  }

  addParticipant(e){
    e.preventDefault();
    Meteor.call('events.add_participant', this.event()._id, function(err){
      if(err){
        toastr.err(err.reason);
      }
      else {
        toastr.success('Added participant!');
      }
    });
  }

  mainDisplay() {
    if(this.event() && this.event().tournament_running){
      return (
        <div className="row center x-center" style={{height: '100%'}}>
          <iframe src={`http://challonge.com/${this.event()._id}/module`} style={{ width: '95%', height: '95vh' }} frameborder="0" scrolling="auto" allowtransparency="true"></iframe>
        </div>
      )
    }
    else {
      return (
        <div>
          {
            this.participants().map(function(p){
              return (
                <PlayerStub {...p} />
              )
            })
          }
          <div>
            <a href="#" onClick={this.addParticipant.bind(this)}>Add Participant</a>
          </div>
        </div>
      )
    }
  }

  cancelTournament(e) {
    Meteor.call('events.destroy_tournament', this.event()._id, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success('Cancelled tournament.');
      }
    });
  }

  sideForm() {
    if(this.event() && this.event().tournament_running){
      return (
        <div style={{textAlign: 'center'}}>
          <h3>Now Running</h3>
          <button onClick={this.cancelTournament.bind(this)}>Cancel</button>
        </div>
      )
    }
    else {
      return (
        <EventTypeForm id={this.props.params.eventId} />
      );
    }
  }

  render() {
    url = '/images/balls.svg';
    if(this.image()){
      url = this.image().url();
    }
    return (
      <div className='row screen'>
        <div className="col-1 user-details">
          <img src={url} style={{width: '100%', height: 'auto'}}/>
          {this.sideForm()}
        </div>
        <div className="col-3">
          {this.mainDisplay()}
        </div>
      </div>
    )
  }
}
