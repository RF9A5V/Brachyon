import React, { Component } from "react";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import ImageForm from "/imports/components/public/img_form.jsx";
import Editor from "/imports/components/public/editor.jsx";

import ProfileImageModal from "./profile_image_modal.jsx";
import ProfileBannerModal from "./profile_banner_modal.jsx";

export default class UserProfile extends ResponsiveComponent {

  editBio() {
    Meteor.call("user.editBio", Meteor.userId(), this.refs.editor.value(), (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated bio!");
      }
    })
  }

  renderBase(opts) {
    const user = Meteor.users.findOne(Meteor.userId());
    const userImage = user && user.profile.imageUrl ? user.profile.imageUrl : null;
    const userBanner = user && user.profile.bannerUrl ? user.profile.bannerUrl : null;
    return (
      <div className="col">
        <div className={opts.dir} style={{marginBottom: 10}}>
          <div className="col center" style={{width: opts.mobile ? "50%" : "calc((100% - 10px) * 9 / 41)", marginRight: 10}}>
            <label className="input-label">Profile Image</label>
            <div style={{width: "100%", position: "relative", cursor: "pointer"}} onMouseEnter={() => {
              this.setState({ imageEdit: true })
            }} onMouseLeave={() => {
              this.setState({ imageEdit: false })
            }} onClick={() => {
              this.refs.imageModal.open();
            }}>
              <img src={userImage || "/images/profile.png"} style={{width: "100%", height: "auto"}} />
              {
                this.state.imageEdit ? (
                  <div className="col center x-center" style={{width: "100%", height: "100%", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.75)", top: 0, left: 0}}>
                    Edit
                  </div>
                ) : (
                  null
                )
              }
            </div>
          </div>
          <div className="col col-1 center">
            <label className="input-label">Profile Banner</label>
            <div style={{width: "100%", position: "relative", cursor: "pointer"}} onMouseEnter={() => {
              this.setState({ bannerEdit: true })
            }} onMouseLeave={() => {
              this.setState({ bannerEdit: false })
            }} onClick={() => {
              this.refs.imageBanner.open()
            }}>
              <img src={userBanner || "/images/bg.jpg"} style={{width: "100%", height: "auto"}} />
              {
                this.state.bannerEdit ? (
                  <div className="col center x-center" style={{width: "100%", height: "100%", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.75)", top: 0, left: 0}}>
                    Edit
                  </div>
                ) : (
                  null
                )
              }
            </div>

          </div>
        </div>
        <Editor ref="editor" value={user.profile.bio} useInsert={true} usePara={true} useTable={true} />
        <div className="row center" style={{marginTop: 10}}>
          <button onClick={this.editBio.bind(this)}>Save</button>
        </div>
        <ProfileImageModal ref="imageModal" />
        <ProfileBannerModal ref="imageBanner" />
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      dir: "row",
      mobile: false
    });
  }

  renderMobile() {
    return this.renderBase({
      dir: "col center x-center",
      mobile: true
    })
  }
}
