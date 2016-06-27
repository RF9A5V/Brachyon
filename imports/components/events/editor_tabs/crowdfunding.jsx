import React, { Component } from 'react';
import CFTree from '../crowdfunding/crowdfunding_tree.jsx';
import TierEditor from './tiers.jsx';

export default class CrowdfundingPanel extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.call('events.create_sponsorship', this.props.id, function(err) {
      if(err){
        toastr.error('Error creating sponsorship for event.');
      }
      else {
        toastr.success('Successfully created sponsorship for event.');
      }
    })
  }

  render() {
    if(!this.props._id){
      return (
        <div>
          <button onClick={this.onClick.bind(this)}>Create Sponsorship</button>
        </div>
      )
    }
    return (
      <div className="row">
        <TierEditor id={this.props._id} />
        <CFTree id={this.props._id} {...this.props} edit={true} />
      </div>
    );
  }
}
