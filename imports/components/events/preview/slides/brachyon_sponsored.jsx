import React, { Component } from "react";

import SponsorModal from "../sponsor_modal.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BrachyonSponsoredSlide extends ResponsiveComponent {

  constructor(props) {
    super(props);
    const event = Events.findOne();

    Meteor.call("events.getPromoters", event.crowdfunding.users, (err, data) => {
      this.state.users = data.map(d => {
        return {
          username: d.username,
          profileImage: d.profile.imageUrl
        }
      });
      this.forceUpdate();
    });
    this.intervalId = setInterval(_ => {
      if(this.state.loading) {
        return;
      }
      var temp = Events.findOne();
      var sponsors = temp.crowdfunding.users;
      if(this.state.users && this.state.users.length < sponsors.length) {
        this.updateSponsors();
        this.state.loading = true;
      }
    }, 1000)
    this.state = {
      open: false
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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

  updateSponsors() {
    const event = Events.findOne();
    const users = event.crowdfunding.users;
    Meteor.call("events.getPromoters", users.slice(this.state.users.length || 0), (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      this.state.users = this.state.users.concat(data.map(d => {
        return {
          username: d.username,
          profileImage: d.profile.imageUrl
        }
      }));
      this.forceUpdate();
    })
  }

  renderBase(opts) {
    const event = Events.findOne();
    return (
      <div className="col center x-center" style={{padding: 10}}>
        <div className="row center">
          <h1>${event.crowdfunding.users.length} Raised!</h1>
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
                  this.state.users.map(user => {
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
