import React, { Component } from "react";

export default class FaqScreen extends Component {
  render() {
    return (
      <div className="box col" style={{padding: 40}}>
        <div className="row center">
          <h2>Tournament Organizer FAQ</h2>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            Give it to me straight - does Brachyon take a percentage of registration? Do I have to use your payment system or can I use cash?
          </div>
          <div className="qa-answer">
            Absolutely not. Brachyon is free for any Tournament Organizer to use. Ticketing incurs no extra charges aside from common credit card processing fees (but don’t worry - your players can always pay with cash).
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            Speaking of payment, how does Brachyon process payments? What are the fees associated with processing payments online?
          </div>
          <div className="qa-answer">
            We use Stripe to handle payments. You can quickly generate a Stripe account that accepts payments and handles refunds. The fee amounts to 2.9% plus 30 cents. However, as mentioned above, you can always avoid this by accepting cash.
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            How do refunds work through Stripe?
          </div>
          <div className="qa-answer">
            The responsibility for refunds or disputes ultimately lies with you, the sellers and not with Brachyon. If a dispute needs more attention, please contact us immediately.
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            How exclusive are Brachyon’s features? How long does it take to make an event?
          </div>
          <div className="qa-answer">
            Our modular event creation system allows anyone to generate a customized tournament, from a simple/free event to a crowdfunded event decked out with brackets and ticketing. Whether you are a seasoned Tournament Organizer or you are looking to break into competitive gaming, we can help you make a tournament which fits your needs in just a few clicks. Aside from required review and approval needed for crowdfunded tournaments, creation is entirely automated on Brachyon. You could have created an event in the time that you read this answer… so what are you waiting for?
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            Tell me more about crowdfunding. Can anyone crowdfund a tournament? How should I set it up?
          </div>
          <div className="qa-answer">
            Anyone can apply crowdfunding to a tournament but we will review your setup to ensure everyone benefits from the process. We suggest setting a funding duration of 30 days or less. Shorter durations tend to have higher success rates. Once your event has launched, it won’t be possible to change your funding duration. Furthermore we ask that your due date for funding land at least 5 days before the event begins to ensure the tournament runs as planned. Your funding goal should be the minimum amount needed to complete the project and fulfill all rewards (including shipping). Because funding is all-or-nothing, you can always raise more than your goal but never less. Once your event has launched, it will not be possible to change your funding goal.
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            Brachyon has to make money somehow… what are the fees applied to crowdfunding?
          </div>
          <div className="qa-answer">
            If your event is successfully funded, the following fees will be collected from your funding total: A 5% crowdfunding fee and standard payment processing fees. If funding isn't successful, there are no fees (we would never be so cruel).
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            How do funds get distributed? What happens if the funding goal is not met?
          </div>
          <div className="qa-answer">
            Stripe allows us to hold payments until the goal is reached. Therefore we either hand over the funding amount to the organizer as soon as their funding duration ends or we redistribute the funds accordingly.
          </div>
        </div>
        <div className="qa-block">
          <div className="qa-question">
            Taxes are boring, can you do it for me?
          </div>
          <div className="qa-answer">
            Stripe issues 1099-K forms by request, so long as you have a U.S. account, $20,000 in gross volume and at least 200 charges. The 1099-K is a purely informational form that summarizes the sales activity of your account and is designed to assist you in reporting your taxes. It is provided to you and the IRS, as well as some US states.
          </div>
        </div>
      </div>
    )
  }
}
