import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { ProfileImages } from "/imports/api/users/profile_images.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ProfileImageSelect extends ResponsiveComponent {

  onSave() {
    var { image, meta, type } = this.refs.img.value();
    meta.userId = Meteor.userId();
    ProfileImages.insert({
      file: image,
      meta,
      fileName: `${Meteor.userId()}_profile.${type}`,
      onUploaded: () => {
        toastr.success("Successfully updated profile image!");
        this.refs.img.reset();
        this.forceUpdate();
      }
    })
  }

  renderBase(opts) {
    const user = Meteor.users.findOne(Meteor.userId());
    const userImage = user && user.profile.imageUrl ? user.profile.imageUrl : null;
    return (
      <div className="col">
        <label>Profile Image</label>
        <div className="row center" style={{width: opts.width, margin: "0 auto"}}>
          <ImageForm url={userImage} ref="img">
            <button style={{marginLeft: 10}} onClick={this.onSave.bind(this)}>Save</button>
          </ImageForm>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      width: "50%"
    });
  }

  renderMobile() {
    return this.renderBase({
      width: "100%"
    });
  }
}
