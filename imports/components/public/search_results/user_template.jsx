import React, { Component } from "react";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class UserTemplate extends Component {

  onClick(e) {
    e.preventDefault();
    this.props.onClick(this.props, this.props.username);
  }

  imgOrDefault(id) {
    var img = ProfileImages.findOne(id);
    if(img == null) {
      return "/images/profile.png";
    }
    return img.link();
  }

  render() {
    return (
      <div className="user-result-template row x-center" onClick={this.onClick.bind(this)}>
        <img src={this.imgOrDefault(this.props.profile.image)} />
        <span style={{marginLeft: 10}}>
          { this.props.username }
        </span>
      </div>
    )
  }
}
