import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class ProfileImageSelect extends Component {

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

  render() {
    const user = Meteor.users.findOne(Meteor.userId());
    const userImage = user && user.profile.imageUrl ? user.profile.imageUrl : null;
    return (
      <div className="col">
        <ImageForm url={userImage} ref="img" />
        <div className="row center">
          <button onClick={this.onSave.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
