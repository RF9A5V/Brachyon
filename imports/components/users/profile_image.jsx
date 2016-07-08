import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import ImageModal from "/imports/components/public/img_modal.jsx";
import ProfileImages from "/imports/api/users/profile_images.js";

export default class ProfileImage extends TrackerReact(Component) {

  componentWillMount() {
    var self = this;
    this.setState({
      hover: false,
      open: false,
      image: null
    })
  }

  imgOrDefault() {
    var image = this.image();
    if(image == null){
      return "/images/profile.png";
    }
    else {
      return image.url({ uploading: "/images/balls.svg", storing: "/images/balls.svg" });
    }
  }

  image() {
    return ProfileImages.find(this.props.imgID).fetch()[0];
  }

  updateProfileImage(id) {
    var self = this;
    this.setState({
      open: false
    });
    Meteor.call("users.update_profile_image", id, function(err) {
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated profile image!");
        if(self.state.image){
          self.state.image.stop();
        }
        self.state.image = Meteor.subscribe("profileImage", id);
      }
    });
  }

  render() {
    if(this.state.image && !this.state.image.ready()){
      return (
        <div>
          <img src="/images/balls.svg" />
        </div>
      )
    }
    return (
      <div className="col x-center">
        <div className="profile-photo" onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})} style={
          {
            backgroundImage: `url(${this.imgOrDefault()})`,
            backgroundSize: "cover"
          }
        }>
          {
            this.state.hover ? (
              <div className="image-overlay" onClick={() => { this.setState({open: true}); }}>
                <b>Edit</b>
              </div>
            ) : (
              ""
            )
          }
        </div>
        <ImageModal open={this.state.open} handler={this.updateProfileImage.bind(this)} />
      </div>
    );
  }
}
