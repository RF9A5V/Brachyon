import React, { Component } from "react";
import { browserHistory } from "react-router";

import ImageForm from "../public/img_form.jsx";
import Editor from "../public/editor.jsx";

import { OrgBanners } from "/imports/api/organizations/org_banners.js"
import { OrgImages } from "/imports/api/organizations/org_profile_images.js"

export default class OrganizationCreateScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: "",
      charCount: 0
    }
  }

  submit(e) {
    e.preventDefault();

    var name = this.refs.organizationName.value;
    var content = this.state.content;

    var profileRef = this.refs.profile;
    var bannerRef = this.refs.banner;

    Meteor.call("organizations.create", name, content, (err, organizations) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else{
        profileRef.setMeta("orgId", organizations);
        bannerRef.setMeta("orgId", organizations);

        if(profileRef.hasValue()) {
          profileRef.value(() => {
            if(bannerRef.hasValue()) {
              bannerRef.value(() => {
                console.log("REEEEE ME!");
              });
            }
            else {
              console.log("REEEE NO BANNER!");
            }
          });
        }
        else {
          if(bannerRef.hasValue()) {
            bannerRef.value(() => {
              console.log("REEE NO PROFILE!");
            });
          }
        }
      }
    });
  }

  setOrgName(name) {
    var text = this.refs.name.value;
    if(text.length > 50) {
      this.refs.name.value = text.substring(0, 50);
    }
    this.setState({
      charCount: this.refs.name.value.length
    })
  }

  setImage(base64) {
    this.setState({
      image: base64
    })
  }

  setBanner(base64) {
    this.setState({
      banner: base64
    })
  }

  setDescriptionState(content) {
    this.setState({
      content
    })
  }

  render() {
    return(
      <div>
        <div className="col" style={{padding: 20, width: "75%", margin: "0 auto"}}>
          <h3 style={{marginBottom: 20, textAlign: "center"}}>Create Organization</h3>
          <h5>Name</h5>
          <input ref="organizationName" type="text" placeholder="Organization Name"/>
          <div className="row">
            <div className="col col-1 x-center">
              <h5>Profile</h5>
              <ImageForm ref="profile" collection={OrgImages} onImgSelected={this.setImage.bind(this)} defaultImage={this.state.image} />
            </div>
            <div className="col col-1 x-center">
              <h5>Banner</h5>
              <ImageForm ref="banner" collection={OrgBanners} aspectRatio={16/9} onImgSelected={this.setBanner.bind(this)} defaultImage={this.state.banner} />
            </div>
          </div>
          <h5>Description</h5>
          <Editor onChange={this.setDescriptionState.bind(this)} useInsert={true} usePara={true} useTable={true} />
          <div className="row center" style={{marginTop: 20}}>
            <button onClick={this.submit.bind(this)}>Create</button>
          </div>
        </div>
      </div>
    )
  }
}
