import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import PaymentContainer from "../../crowdfunding/payment_container.jsx";
import SkillTree from "../stretch.jsx";
import TierPaymentContainer from "../tier_payment_container.jsx";
import CFModal from "../cf_modal.jsx";
import Loading from "/imports/components/public/loading.jsx";
import RewardTooltip from "../reward_tooltip.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class CrowdfundingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ready: false,
      rewardTooltipOpen: false
    };
  }

  componentWillUnmount() {
    if(this.state.rewards) {
      this.state.rewards.stop();
    }
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = "/images/bg.jpg";
    if(this.props.event && this.props.event.details.banner) {
      imgUrl = Images.findOne(this.props.event.details.banner).link();
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  openPaymentForm(i) {
    this.refs[`payment${i}`].openModal();
  }

  profileImage(id) {
    var user = Meteor.users.findOne(id);
    if(user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  render() {
    if(!this.state.ready) {
      var rewards = Meteor.subscribe("rewards", Events.findOne().slug, {
        onReady: () => {
          this.setState({
            ready: true,
            rewards
          })
        }
      });
      return <Loading />
    }
    var cf = this.props.event.crowdfunding.details;
    var sponsors = this.props.event.crowdfunding.sponsors || [];
    var tiers = this.props.event.crowdfunding.tiers;
    var ledger = Instances.findOne().cf || {};
    var totalPeople = [];
    var totalDollars = Object.keys(ledger).map(key => {
      var index = parseInt(key);
      totalPeople = totalPeople.concat(ledger[key].map(spons => { return spons.payee }));
      return ledger[key].length * tiers[index].price;
    }).reduce((a, b) => { return a + b }, 0);
    totalPeople = Array.from(new Set(totalPeople)).length
    return (
      <div className="slide-page-container">
        <div className="slide-page row" style={{backgroundImage: this.backgroundImage(true)}}>
          <div className="col-4 col cf-main">
            <div className="col x-center cf-progress">
              <span className="cf-progress-amount">
                {
                  cf.amount == 0 ? (
                    `$${(totalDollars / 100) || 0} raised!`
                  ) : (
                    `$${(totalDollars / 100) || 0} out of ${cf.amount} raised!`
                  )
                }
              </span>
              {
                cf.amount == 0 ? (
                  ""
                ) : (
                  <div className="cf-progress-container">
                    <div className="cf-progress-display" style={{width: `${Math.min((totalDollars || 0) / cf.amount * 100, 100)}%`}}></div>
                  </div>
                )
              }

              {
                totalPeople > 0 ? (
                  <h5>{ totalPeople } sponsor{ totalPeople == 1 ? "" : "s" }!</h5>
                ) : (
                  <h5>No Sponsors Yet!</h5>
                )
              }
            </div>
            <div className="tier-container row" style={{flexWrap: "wrap", width: "100%", marginTop: 20}}>
              {
                tiers.map((tier, i) => {
                  var alreadyBought = ledger && ledger[i] && ledger[i].some(obj => { return obj.payee == Meteor.userId() });
                  return (
                    <div className="tier-preview-block" onClick={() => { if(alreadyBought){ return toastr.warning("Already bought this tier!"); } this.setState({ open: true, tier, i }) }}>
                      <div className="row" style={{marginBottom: 20}}>
                        <div className="row col-1">
                          <h3 style={{marginRight: 10}}>{ tier.name }</h3>
                          {
                            alreadyBought ? (
                              <FontAwesome name="check" />
                            ) : (
                              ""
                            )
                          }
                        </div>
                        <h5>${ (tier.price / 100).toFixed(2) }</h5>
                      </div>
                      <div className="row">
                        {
                          tier.rewards.map(reward => {
                            return (
                              <div style={{borderRadius: "100%"}} onMouseEnter={() => {
                                this.setState({
                                  reward,
                                  rewardTooltipOpen: true
                                })
                              }} onMouseLeave={() => {
                                this.setState({
                                  reward: null,
                                  rewardTooltipOpen: false
                                })
                              }}>
                                <img src={Rewards.findOne(reward).imgUrl} />
                              </div>
                            )
                          })
                        }
                      </div>
                      <div className="row">
                        <div className="col-1">
                        </div>
                        <i>{ tier.limit - ((Instances.findOne().cf || {})[i] || []).length } remaining</i>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {
          this.state.open ? (
            <CFModal open={this.state.open} close={() => { this.setState({open: false}) }} tier={this.state.tier} index={this.state.i} />
          ) : (
            ""
          )
        }
        {
          this.state.rewardTooltipOpen ? (
            <RewardTooltip reward={this.state.reward} />
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
