import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class UserImage extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      open: false
    }
  }

  onImageUpload() {
    var { image, meta, type } = this.refs.img.value();
    meta.userId = Meteor.userId();
    ProfileImages.insert({
      file: image,
      meta,
      fileName: Meteor.userId() + "." + type,
      onUploaded: (err) => {
        if(err) {
          toastr.error(err.reason);
          throw new Error(err.reason);
        }
        toastr.success("Updated profile image!");
        this.setState({
          open: false
        })
      }
    });
  }

  renderBase(opts) {
    const user = Meteor.users.findOne({
      username: this.props.username
    });
    return (
      <div className="row center x-center" style={{
        position: "absolute",
        width: opts.imgDim,
        height: opts.imgDim,
        top: -(opts.imgDim / 2),
        left: (opts.imgDim / 3),
        borderRadius: "100%",
        backgroundImage: `${this.state.hover ? "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))," : ""} url(${user.profile.imageUrl || "/images/profile.png"})`,
        backgroundSize: "100% 100%"
      }} onMouseEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if(this.props.editMode) {
          this.setState({
            hover: true
          })
        }
      }} onMouseLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if(this.props.editMode) {
          this.setState({
            hover: false
          })
        }
      }} onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if(this.props.editMode) {
          this.setState({
            open: true
          })
        }
      }}>
        {
          this.state.hover ? (
            <span>
              Edit Image
            </span>
          ) : (
            null
          )
        }
        <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.state.open} onRequestClose={() => {
          this.setState({
            open: false
          })
        }}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: opts.iconSize}} onClick={() => {
              this.setState({ open: false })
            }} />
          </div>
          <div style={{width: "50%", margin: "0 auto"}}>
            <ImageForm aspectRatio={1} url={user.profile.imageUrl || "/images/profile.png"} ref="img">
              <button onClick={this.onImageUpload.bind(this)} className={opts.buttonClass} style={{marginLeft: 10}}>Save</button>
            </ImageForm>
          </div>
          <div className="row center">

          </div>
        </Modal>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      imgDim: 200,
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      iconSize: "5em",
      buttonClass: "large-button"
    });
  }

  renderDesktop() {
    return this.renderBase({
      imgDim: 150,
      modalClass: "",
      overlayClass: "",
      iconSize: "2em",
      buttonClass: ""
    });
  }

}
