import React, { Component } from 'react';
import CFTree from '../crowdfunding/crowdfunding_tree.jsx';\
import TierEditor from './tiers.jsx';

export default class CrowdfundingPanel extends Component {
  render() {
    return (
      <div className="row">
        <TierEditor id={this.props.sponsorship._id} />
        <CFTree id={this.props.sponsorship._id} {...this.props.sponsorship} edit={true} />
      </div>
    );
  }
}
