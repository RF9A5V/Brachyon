import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ImageForm from "/imports/components/public/img_form.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class ProfileImageModal extends Component {

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
    ProfileImages.insert({
      file: image,
      meta,
      fileName: `${Meteor.userId()}_profile.${type}`,
      onUploaded: () => {
        toastr.success("Successfully updated profile image!");
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
        <div style={{width: "80%", margin: "0 auto"}}>
          <ImageForm url={user.profile.imageUrl} ref="img">
            <button style={{marginLeft: 10}} onClick={this.onSave.bind(this)}>
              Save
            </button>
          </ImageForm>
        </div>
      </Modal>
    )
  }
}
