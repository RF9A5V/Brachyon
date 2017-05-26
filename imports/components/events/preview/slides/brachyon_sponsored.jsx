import React, { Component } from "react";

import SponsorModal from "../sponsor_modal.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

export default class BrachyonSponsoredSlide extends Component {

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

  render() {
    return (
      <div className="col center x-center" style={{padding: 10}}>
        <div className="row center" style={{marginBottom: 10}}>
          <button onClick={this.openModal.bind(this)}>Share Event</button>
        </div>
        <div style={{width: "100%", height: "60%", backgroundColor: "rgba(0, 0, 0, 0.75)", padding: 10, overflowY: "auto", alignItems: "flex-start"}}>
          {
            this.state.users ? (
              <RowLayout length={6}>
                {
                  this.event.crowdfunding.users.map(u => {
                    const user = this.state.users[u];
                    return (
                      <div className="row col-1" style={{backgroundColor: "#666"}}>
                        <img src={user.profileImage || "/images/profile.png"} style={{width: 50, height: 50}} />
                        <div style={{padding: 10}}>
                          <span>{ user.username }</span>
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
}
