import React, { Component } from "react";

import SponsorModal from "../sponsor_modal.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BrachyonSponsoredSlide extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.event = Events.findOne();

    Meteor.call("events.getPromoters", this.event.crowdfunding.users, (err, data) => {
      var users = {};
      data.forEach(d => {
        users[d._id] = {
          username: d.username,
          profileImage: d.profile.imageUrl
        }
      });
      this.state.users = users;
      this.forceUpdate();
    });
    this.state = {
      open: false
    }
  }

  openModal() {
    const user = Meteor.userId();
    if(!user) {
      this.setState({
        open: true
      })
    }
    else {
      this.refs.modal.open();
    }
  }

  renderBase(opts) {
    return (
      <div className="col center x-center" style={{padding: 10}}>
        <div className="row center">
          <h1>${this.event.crowdfunding.users.length} Raised!</h1>
        </div>
        <div className="row center">
          <button className={opts.buttonClass} onClick={this.openModal.bind(this)}>Share Event</button>
        </div>
        <div className="row center">
          <h2 style={{marginTop: 10, fontSize: opts.fontSize}}>1 Share = $1+ To Pot Bonus</h2>
        </div>
        <div style={{width: "100%", height: "60%", backgroundColor: "rgba(0, 0, 0, 0.75)", padding: 10, overflowY: "auto", alignItems: "flex-start"}} onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
          {
            this.state.users ? (
              <RowLayout length={opts.rowLength}>
                {
                  this.event.crowdfunding.users.map(u => {
                    const user = this.state.users[u];
                    return (
                      <div className="row col-1" style={{backgroundColor: "#666"}}>
                        <img src={user.profileImage || "/images/profile.png"} style={{width: opts.imgDim, height: opts.imgDim}} />
                        <div className="row col-1" style={{padding: 10}}>
                          <span className="marquee" style={{fontSize: opts.fontSize}}>{ user.username }</span>
                        </div>
                      </div>
                    )
                  })
                }
              </RowLayout>
            ) : (
              "No promoters for this event yet!"
            )
          }
        </div>
        <SponsorModal ref="modal" />
        <RegModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} onSuccess={() => {
          this.openModal();
        }} />
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      buttonClass: "",
      rowLength: 6,
      imgDim: 50
    });
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "1.5em",
      rowLength: 1,
      imgDim: 100
    })
  }
}
