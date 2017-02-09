import React, { Component } from 'react';

export default class EventTypeForm extends Component {

  constructor() {
    super();
    this.state = {
      type: 0
    }
  }

  submit(e) {
    e.preventDefault();
    args = {};
    if(this.state.type == 1){
      args = {
        hold_third_place_match: this.refs.singleElimMatch.value,
        tournament_type: 'single elimination'
      }
    }
    else if(this.state.type == 2){
      args = {
        grand_finals_modifier: this.refs.doubleElimFinals.value,
        tournament_type: 'double elimination'
      }
    }
    else if(this.state.type == 3){
      args = {
        tournament_type: 'swiss'
      }
    }
    else if(this.state.type == 4){
      args = {
        tournament_type: 'round robin'
      }
    }
    Meteor.call('events.create_tournament', this.props.id, args, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Created single elimination tournament!");
      }
    })
  }

  singleElimForm() {
    return (
      <div className="col">
        <h3>Single Elimination</h3>
        <select ref="singleElimMatch" style={{marginBottom: 10}}>
          <option>-- Match for Third? --</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <div>
          <button onClick={this.submit.bind(this)}>Submit</button>
        </div>
      </div>
    );
  }

  doubleElimForm() {
    return (
      <div ref="doubleElim" className="col">
        <h3>Double Elimination</h3>
        <select ref="doubleElimFinals" style={{marginBottom: 10}}>
          <option>-- Finals Modifier --</option>
          <option value="">Standard</option>
          <option value="single match">Single Match</option>
          <option value="skip">Skip Finals</option>
        </select>
        <div>
          <button onClick={this.submit.bind(this)}>Submit</button>
        </div>
      </div>
    );
  }

  swissForm() {
    return (
      <div>
        <button onClick={this.submit.bind(this)}>Submit</button>
      </div>
    );
  }

  rrForm() {
    return (
      <div>
        <button onClick={this.submit.bind(this)}>Submit</button>
      </div>
    );
  }

  contextualForm() {
    
    // I'm tired and switches were bugging out.
    if(this.state.type == 0){
      return (
        <div>
          Select a type!
        </div>
      );
    }
    else if(this.state.type == 1){
      return this.singleElimForm();
    }
    else if(this.state.type == 2){
      return this.doubleElimForm();
    }
    else if(this.state.type == 3){
      return this.swissForm();
    }
    else if(this.state.type == 4){
      return this.rrForm();
    }
  }

  onChange(e) {
    this.setState({
      type: e.target.value
    })
  }

  render() {
    return (
      <div>
        <select defaultValue={0} onChange={this.onChange.bind(this)}>
          <option value={0}>-- Select One --</option>
          <option value={1}>Single Elimination</option>
          <option value={2}>Double Elimination</option>
          <option value={3}>Swiss</option>
          <option value={4}>Round Robin</option>
        </select>
        <div style={{textAlign: 'center', marginTop: 20}}>
          {this.contextualForm()}
        </div>
      </div>
    );
  }
}
