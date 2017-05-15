import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";

export default class ProfileBanner extends Component {

  onSave() {
    var { image, meta, type } = this.refs.img.value();
    meta.userId = Meteor.userId();
    ProfileBanners.insert({
      file: image,
      meta,
      fileName: `${Meteor.userId()}_profile.${type}`,
      onUploaded: () => {
        toastr.success("Successfully updated profile banner!");
        this.refs.img.reset();
        this.forceUpdate();
      }
    })
  }

  render() {
    const user = Meteor.users.findOne(Meteor.userId());
    const userImage = user && user.profile.imageUrl ? user.profile.bannerUrl : null;
    return (
      <div className="col">
        <label>Profile Banner</label>
        <ImageForm url={userImage} ref="img" aspectRatio={16/4.5}>
          <button style={{marginLeft: 10}} onClick={this.onSave.bind(this)}>Save</button>
        </ImageForm>
      </div>
    )
  }
}
