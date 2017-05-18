import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ImageForm from "/imports/components/public/img_form.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";

export default class ProfileBannerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  open() {
    this.setState({
      open: true
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  onSave() {
    var { image, meta, type } = this.refs.img.value();
    meta.userId = Meteor.userId();
    ProfileBanners.insert({
      file: image,
      meta,
      fileName: `${Meteor.userId()}_profile.${type}`,
      onUploaded: () => {
        toastr.success("Successfully updated profile banner!");
        this.close();
      }
    })
  }

  render() {
    const user = Meteor.user();
    return (
      <Modal isOpen={this.state.open} onRequestClose={this.close.bind(this)}>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome name="times" size="2x" onClick={this.close.bind(this)} />
        </div>
        <ImageForm url={user.profile.bannerUrl} aspectRatio={16/4.5} ref="img">
          <button onClick={this.onSave.bind(this)} style={{marginLeft: 10}}>Save</button>
        </ImageForm>
      </Modal>
    )
  }
}
