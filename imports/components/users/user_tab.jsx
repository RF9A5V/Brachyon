import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class UserTab extends ResponsiveComponent {
  renderBase(opts) {
    var user = Meteor.users.findOne(this.props.id);
    return (
      <div className="row" style={{width: opts.width, marginRight: 10, marginBottom: 10}}>
        <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: opts.imgDim, height: opts.imgDim}} />
        <div className={`col-1 ${this.props.alias.length > 10 ? "marquee" : ""}`} style={{
          padding: 10,
          backgroundColor: Meteor.userId() != null && this.props.id == Meteor.userId() ? "#FF6000" : "#666",
          fontSize: opts.fontSize,
          overflowX: "hidden",
          textOverflow: "ellipsis" }}>
          { this.props.alias }
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em",
      imgDim: 150,
      width: "45%"
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      imgDim: 50,
      width: 150
    });
  }
}
