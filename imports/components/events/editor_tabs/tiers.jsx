import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import TierForm from './tier_form.jsx';
import HoverBlock from '../../public/hover_block.jsx';

export default class TierEditor extends Component {

  componentWillMount() {
    this.setState({
      open: false
    })
  }

  sponsorship() {
    return Sponsorships.find().fetch()[0];
  }

  createTier(e){
    self = this;
    e.preventDefault();
    Meteor.call('sponsorships.create_tier', this.props.id, function(err){
      if(err){
        toastr.error('Issue creating tier for event.')
      }
      else {
        toastr.success('Successfully created tier.')
        self.forceUpdate();
      }
    })
  }

  editTier(index){
    return function(e){
      e.preventDefault();
      el = e.target;
      if(el.classList.contains('ticket-delete')){
        return;
      }
      while(!el.classList.contains('ticket-bg') && (el = el.parentElement));
      rect = el.getBoundingClientRect();
      this.setState({
        x: rect.left,
        y: rect.top,
        open: true,
        index
      })
    }
  }

  updateTier(attrs) {
    tiers = this.sponsorship().tiers
    Object.keys(attrs).map((val) => { tiers[this.state.index][val] = attrs[val] })
    Meteor.call('sponsorships.update_tier', this.props.id, tiers, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success('Successfully updated tier.');
      }
    })
  }

  deleteTier(e) {
    e.preventDefault();
  }

  render() {
    self = this;
    return (
      <div className="col x-center col-1">
        {
          this.sponsorship().tiers.map(function(tier, index){
            return (
              <div className="ticket-bg col" style={{alignItems: 'flex-start'}} onClick={self.editTier(index).bind(self)}>
                <a href="#" style={{alignSelf: 'flex-end'}} className="ticket-delete" onClick={self.deleteTier.bind(self)}>
                  <FontAwesome name="times" className="ticket-delete" />
                </a>
                <div className="row">
                  <h2>{tier.name}</h2>
                </div>
                <div>
                  {tier.description}
                </div>
                <div className="col-1 row" style={{alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                  <span>
                    ${(tier.amount / 100).toFixed(2)}
                  </span>
                  <span>
                    <i>0</i>
                    &nbsp;&nbsp;out of&nbsp;
                    <i>{tier.limit}</i>
                  </span>
                </div>
              </div>
            )
          })
        }
        {
          this.state.open ? (
            <HoverBlock x={this.state.x + 340} y={this.state.y} open={this.state.open} handler={() => { this.setState({open: false}) }}>
              <TierForm {...this.sponsorship().tiers[this.state.index]} handler={this.updateTier.bind(this)} />
            </HoverBlock>
          ) : (
            ""
          )
        }
        <div className="ticket-bg" onClick={this.createTier.bind(this)}>
          Create A Tier
        </div>
      </div>
    )
  }
}
