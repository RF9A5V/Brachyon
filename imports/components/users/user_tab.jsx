import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class UserTab extends ResponsiveComponent {
  renderBase(opts) {
    var obj;
    var user = Meteor.users.findOne(this.props.id);
    if(user) {
      obj = {
        id: this.props.id,
        img: user.profile.imageUrl,
        alias: user.profile.alias || user.username
      };
    }
    else {
      obj = {
        id: this.props._id,
        img: (this.props.profile || {}).imageUrl,
        alias: this.props.username || this.props.alias
      };
    }
    return (
      <div className="row" style={{width: opts.width, marginRight: 10, marginBottom: 10}} onClick={() => {
        if(this.props.onClick) {
          this.props.onClick();
        }
      }}>
        <img src={obj.img || "/images/profile.png"} style={{width: opts.imgDim, height: opts.imgDim}} />
        <div className={`col-1 ${obj.alias.length > 10 ? "marquee" : ""}`} style={{
          padding: 10,
          backgroundColor: Meteor.userId() != null && obj.id == Meteor.userId() ? "#FF6000" : "#666",
          fontSize: opts.fontSize,
          overflowX: "hidden",
          textOverflow: "ellipsis" }}>
          { obj.alias }
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
