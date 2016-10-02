import React, { Component } from "react";

import PaymentContainer from "../../crowdfunding/payment_container.jsx";
import SkillTree from "../stretch.jsx";
import TierPaymentContainer from "../tier_payment_container.jsx";

export default class CrowdfundingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = "/images/bg.jpg";
    if(this.props.event && this.props.event.bannerUrl) {
      imgUrl = this.props.event.bannerUrl;
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  openPaymentForm(i) {
    this.refs[`payment${i}`].openModal();
  }

  render() {
    var cf = this.props.event.crowdfunding.details;
    var sponsors = this.props.event.crowdfunding.sponsors || [];
    var tiers = this.props.event.crowdfunding.tiers;
    return (
      <div className="slide-page-container">
        <div className="slide-page row" style={{backgroundImage: this.backgroundImage(true)}}>
          <div className="col-3 col cf-main">
            <div className="row x-center">
              <div className="col col-3 cf-progress">
                <span className="cf-progress-amount">
                  ${(cf.current || 0) / 100} out of ${cf.amount / 100}
                </span>
                <div className="cf-progress-container">
                  <div className="cf-progress-display" style={{width: `${Math.min((cf.current || 0) / cf.amount * 100, 100)}%`}}></div>
                </div>
              </div>
              <div className="cf-leaderboard col-2">
                {
                  sponsors ? (
                    sponsors.sort((a, b) => { return b.price - a.price; }).slice(0, 3).map((sponsor) => {
                      var user = Meteor.users.findOne(sponsor.id);
                      return (
                        <div className="sponsor-item col center">
                          <div className="row x-center">
                            <img src={ user.profile.image ? ProfileImages.findOne(user.profile.image).url() : "/images/profile.png"} />
                            <span>{ Meteor.users.findOne(sponsor.id).username } - ${sponsor.amount / 100}</span>
                          </div>
                          <p>
                            { sponsor.comment }
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    ""
                  )
                }
              </div>
            </div>
            {
              // <div className="cf-strategy">
              //   {
              //     revenue.strategy && revenue.strategy.name == "skill_tree" ? (
              //       <SkillTree goals={revenue.strategy.goals} onGoalSelect={() => {}} />
              //     ) : (
              //       ""
              //     )
              //   }
              // </div>
            }
          </div>
          <div className="col-1 col cf-tiers">
            {
              tiers ? (
                tiers.map((tier, i) => {
                  return (
                    <div className="cf-tier col" onClick={() => {this.openPaymentForm(i)}}>
                      <div className="row flex-pad x-center">
                        <span className="cf-amount">
                          ${tier.price.toFixed(2)}
                        </span>
                        <span className="cf-limit">
                          {tier.limit - (tier.sponsors || []).length} Remaining
                        </span>
                      </div>
                      <p className="cf-description">
                        { tier.description }
                      </p>
                      <TierPaymentContainer tier={tier} ref={"payment"+i} index={i} />
                    </div>
                  )
                })
              ) : (
                ""
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
