import React, { Component } from "react";

import ImageForm from "../../public/img_form.jsx";

export default class UserDetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profileChanged: false
    }
  }

  genericError(item) {
    return function(err) {
      if(err){
        toastr.error(err.reason);
        toastr.error("Failed to update " + item + "!", "Error!");
      }
      else {
        toastr.success("Updated " + item + "!", "Success!");
        if(this.props.refresh){
          this.props.refresh();
        }
      }
    }
  }

  saveProfileImage(e) {
    e.preventDefault();
    var imageID = this.refs.profileImage.value();
    if(Meteor.user() && Meteor.user().profile.image != imageID) {
      Meteor.call("users.update_profile_image", imageID, this.genericError("profile image").bind(this));
    }
    else {
      toastr.warning("No changes to be made.", "Warning!");
    }
  }

  saveBannerImage(e) {
    e.preventDefault();
    var imageID = this.refs.profileBanner.value();
    if(Meteor.user() && Meteor.user().profile.image != imageID) {
      Meteor.call("users.update_profile_banner", imageID, this.genericError("banner image").bind(this));
    }
    else {
      toastr.warning("No changes to be made.", "Warning!");
    }
  }

  saveAlias(e) {
    e.preventDefault();
    if(Meteor.user() && Meteor.user().profile.alias != this.refs.alias.value) {
      Meteor.call("users.update_alias", this.refs.alias.value, this.genericError("alias").bind(this));
    }
    else {
      toastr.warning("No changes to be made.", "Warning!");
    }
  }

  render() {
    return (
      <div className="col">
        <div className="row">
          <div className="side-tab-panel">
            <div className="row x-center">
              <span className="col-1">Profile Image</span>
              <button onClick={this.saveProfileImage.bind(this)}>Save</button>
            </div>
            <ImageForm aspectRatio={1} collection={ProfileImages} id={Meteor.user().profile.image} ref="profileImage" store="profile_images" />
          </div>
          <div className="side-tab-panel">
            <div className="row x-center">
              <span className="col-1">Profile Banner</span>
              <button onClick={this.saveBannerImage.bind(this)}>Save</button>
            </div>
            <ImageForm aspectRatio={16/4} collection={ProfileBanners} id={Meteor.user().profile.banner} ref="profileBanner" />
          </div>
        </div>
        <div className="row">
          <div className="side-tab-panel">
            <div className="row x-center">
              <span className="col-1">Alias</span>
              <button onClick={this.saveAlias.bind(this)}>Save</button>
            </div>
            <div>
              <input type="text" ref="alias" style={{width: 400}} maxlength={40} defaultValue={Meteor.user().profile.alias || Meteor.user().username} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
