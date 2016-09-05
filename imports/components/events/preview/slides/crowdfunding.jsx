import React, { Component } from "react";

import PaymentContainer from "../../crowdfunding/payment_container.jsx";

export default class CrowdfundingPage extends Component {

  backgroundImage(useDarkerOverlay){
    var imgUrl = "/images/bg.jpg";
    console.log(this.props.event.bannerUrl);
    if(this.props.event && this.props.event.bannerUrl) {
      imgUrl = this.props.event.bannerUrl;
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  openPaymentForm() {
    this.refs.paymentForm.openModal();
  }

  render() {
    var revenue = this.props.event.revenue;
    return (
      <div className="slide-page-container">
        <div className="slide-page row" style={{backgroundImage: this.backgroundImage(true)}}>
          <div className="col-3 col cf-main">
            <div className="row x-center">
              <div className=" col col-3 cf-progress">
                <span className="cf-progress-amount">
                  ${(revenue.crowdfunding.current || 0) / 100} out of ${revenue.crowdfunding.amount / 100}
                </span>
                <div className="cf-progress-container">
                  <div className="cf-progress-display" style={{width: `${(revenue.crowdfunding.current || 0) / revenue.crowdfunding.amount * 100}%`}}></div>
                </div>
              </div>
              <div className="cf-leaderboard col-2">
                {
                  revenue.crowdfunding.sponsors ? (
                    revenue.crowdfunding.sponsors.sort((a, b) => { return b.amount - a.amount; }).slice(0, 3).map((sponsor) => {
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
            <div className="cf-strategy">
            </div>
          </div>
          <div className="col-1 col cf-tiers">
            {
              revenue.tierRewards ? (
                revenue.tierRewards.map((tier) => {
                  return (
                    <div className="cf-tier col" onClick={this.openPaymentForm.bind(this)}>
                      <div className="row flex-pad x-center">
                        <span className="cf-amount">
                          ${tier.amount / 100}
                        </span>
                        <span className="cf-limit">
                          {tier.limit} Remaining
                        </span>
                      </div>
                      <p className="cf-description">
                        { tier.description }
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
        <PaymentContainer ref="paymentForm"/>
      </div>
    )
  }
}
