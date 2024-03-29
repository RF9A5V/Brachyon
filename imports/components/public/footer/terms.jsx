import React from 'react';
import { Link } from 'react-router';
import LoaderContainer from "/imports/components/public/loader_container.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class TermsScreen extends ResponsiveComponent {

  constructor() {
    super();
    this.state = {
      initReady: true,
      ready: false
    }
  }

  render() {

    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.initReady} onReady={() => { this.setState({ready: true}) }} />
      )
    }

    return(
      <div className={`col ${this.state.render == "mobile" ? "" : "side-tab-panel"}`} style={{padding: this.state.render == "mobile" ? 10 : 0}}>
        <h2 style={{margin: 0, textAlign: "center"}}>Terms of Service</h2>
        <div className="about-what" style={{textAlign: "left"}}>
          Our terms of services cover any access to any of our services including
          Brachyon's applications, websites, APIs, email notifications, commerce
          services, ticketing, ads, and any information, photos, graphics, or other
          materials . Using any of our services is conditioned upon your consent and
          compliance of the Terms. Using any of these services bounds you to these terms.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          These terms will be readily accessible at any time regardless if you have an
          account with Brachyon or not, and understanding these terms is your responsibility.
          At any given time these terms may be revised and changed. We will make an
          announcement and alert you of any major changes to the terms and place the
          timestamp of the last revision at the bottom of these terms.
        </div>
        <h4>Basic Terms</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          By using our services, you are responsible for anything you upload and the
          consequences of doing so. Banners uploaded onto your account or public
          tournaments by default will be accessible to any other users of the website
          including third party services and other websites. Otherwise information
          uploaded onto your account such as name, location, age, and any other
          information will be private for only the your viewing by default, but whom
          you restrict it to may limit some of the services accessible.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          Copyrighted material uploaded onto Brachyon is prohibited unless you own the
          copyright or have legal access to the material. Any material deemed
          inappropriate (vulgar, obscene, profane, threatening, or invasive of privacy
          for example) will be removed and can be used as grounds to terminate your
          account. If you believe any material uploaded is copyrighted or
          inappropriate, it is encouraged that you alert the administration staff of
          the website.
        </div>
        <h4>Account</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          You are responsible for the safeguarding of your account information such
          as your password and email. Brachyon is not responsible for any losses or
          damages resulting from a compromised password. It is encouraged that you
          keep a strong password and do not give away your information to any other
          third party. You are responsible for any activity on your account. At any
          point of time Brachyon reserves the right to terminate your account.
        </div>
        <h4>Event Creation Service</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          At any time Brachyon can terminate a created event. Reasons for doing so
          may be (but not limited to) for any of the following: Request by the owner
          of the intellectual property the tournament is held for, display of
          inappropriate material, termination of account of event holders, violation
          of other terms, violation of local or federal law, or repeated failure to
          meet with promised timeline.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          For any crowdfunded event you must agree to a timeline detailing out the
          time limit for which the funding takes place, the time in which the
          tournament is held, and when the prizes for the tournaments are released.
          Agreeing to this timeline is paramount to the trust between Brachyon and the
          crowdfunders and failure to comply can result in mandatory refund to the
          backers and potentially termination of your account. Funding for the
          tournament can continue given that the goal is met until a week prior to
          the date of the tournament's launch.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          At the end of the goal, 5% of the overall goal will be collected by Brachyon
          during the transfer process to the creator including any further pledges
          past the goal.
        </div>
        <h4>Crowdfunding</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          When promising certain amounts of funds to an event, you will be charged
          when funding for the tournament ends given it met its goal. If the event
          fails to reach its goal then no funds will be taken nor used elsewhere.
          At any time you are allowed to cancel your pledge into a tournament prior
          to the end of the funding stage. For any stretch goals or rewards you may
          be required to answer questions such as mailing address and country to
          receive them.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          After the funding stage of a tournament, refunds are done through Stripe.
          Tournament quality cannot be guaranteed by Brachyon but by the event creator.
          Any and all payments after the pledge will be collected immediately and is
          under the same rules of refunding as any cash collected by the end of the
          goal.
        </div>
        <h4>Tournament Management Software</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          Access to the tournament management software is free to use and does not
          require an account, although guarantee of saving the information of the
          tournament requires an account. Tournament progress can be linked to a
          created event and tracked from there. Other viewers along with third party
          websites can receive and track progress of a tournament at any given time.
        </div>
        <div className="about-what" style={{textAlign: "left"}}>
          If set up to do so, you can link your account toward a tournament to record
          your statistics onto your account. This process requires the confirmation of
          both the tournament manager and the user account itself. Anyone viewing the
          tournament including third party websites can view your account from the
          tournament page unless you choose to opt out. Some tournaments may require
          you to link your account or may not allow linking.
        </div>
        <h4>Costs of Service</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          Tournament management, account creation, event participation, and event
          creation without crowdfunding are free to use for any user. 5% of funds
          from crowdfunding will be taken for us given the event meets its goal, and
          5% of the funds funded afterward will also be charged. If using rewards or
          stretch goals provided by other companies the company may take their own
          cut as well. The size is up to the discretion of the company. A small
          percent is required to be payed to Stripe for ticketing, it is up to the
          event creators' discretion for whether the creator will pay it or the
          participants will pay it.
        </div>
        <h4>Indemnification</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          Under any situation where your action leads Brachyon to be sued or break
          the terms of service, you agree through these terms that you are to defend,
          indemnify, and hold us harmless from all liabilities, claims, and expenses
          (including within reason the legal costs and attorney fees) from your use
          or misuse of our services related to the lawsuit. At any time, Brachyon
          reserves the right to take exclusive control of the defense of the matter
          subject to this cause, in which case you must cooperate and help us in this
          defense.
        </div>
        <h4>Limitation of Liability</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BRACHYON, ITS EMPLOYEES,
          PARTNERS, DIRECTORS, SUPPLIERS, OR CONTENT PROVIDERS WILL NOT BE LIABLE FOR
          ANY INDIRECT, INCIDENTIAL, PUNITIVE, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY
          DAMAGES OF ANY KIND, (i) INCLUDING ACCESS OR LACK OF ACCESS TO OF SERVICES,
          (ii) ANY CONDUCT OR CONTENT FROM THIRD PARTY ON THE SERVICES, INCLUDING
          WITHOUT LIMITATION, OFFENSIVE, DEFAMATORY, OR ILLEGAL CONDUCT OF OTHER USERS
          OR THIRD PARTIES, (iii) ANY CONTENT OBTAINED FROM THE SERVICES, (iv)
          UNAUTHORIZED ACCESS, USE OF ALTERATION OF YOUR TRANSMISSIONS OF CONSENT.
          BRACHYON'S LIABLILITY WILL UNDER NO SITUATION FOR DIRECT DAMAGES EXCEED ONE
          HUNDRED U.S. DOLLARS ($100.00).
        </div>
        <h4>Warranty Disclaimer</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          BRACHYON DISCLAIMS ANY AND ALL WARRANTIES AND CONDITIONS OF MERCHANTABILITY,
          NON-INFRINGEMENT, AND FITNESS FOR ANY PARTICULAR PURPOSE, AND ANY WARRANTIES
          IMPLIED BY ANY COURSE OF DEALING, COURSE OF PERFORMANCE, OR USAGE OF TRADE.
          NO ADVICE OR INFORMATION (WRITTEN OR ORAL) GIVEN OR OBTAINED BY YOU FROM
          BRACHYON SHALL CONSTITUTE AS ANY KIND OF WARRANTY.
        </div>
        <h4>Law and Jurisdiction</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          These terms and any action related to these terms are governed and under the
          jurisdiction of the state of California without regard to or application of
          its conflict of law provisions or your state or country of residence. Any
          and all claims, legal proceedings or litigation related to these terms or
          services will be brought to the Los Angeles federal or state courts.
          Agreeing to these terms means you waive any objection to the use of these
          courts for reasons of inconvenience and consent to their jurisdiction.
        </div>
        <h4>Miscellaneous</h4>
        <div className="about-what" style={{textAlign: "left"}}>
          These terms supersede or replace any prior agreement, whether written or
          oral, between Brachyon and your use of these services. We may at any time
          revise and change these terms, but the most updated revision of the terms
          will be found at http://www.brachyon.com/terms. Brachyon will update you during any major revision
          through the email associated with your account. By continuing to use our
          services, you give us your consent to be bound by these revisions.
        </div>
      </div>
    );
  }
}
