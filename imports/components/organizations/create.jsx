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
    var content = this.refs.description.value();

    var profileRef = this.refs.profile.value();
    var bannerRef = this.refs.banner.value();

    Meteor.call("organizations.create", name, content, (err, organizations) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else{
        var href = `/org/${organizations}`;

        if(profileRef) {
          profileRef.meta.orgSlug = organizations;
          OrgImages.insert({
            file: profileRef.image,
            meta: profileRef.meta,
            onUploaded: () => {
              browserHistory.push(href);
            }
          })
        }
        if(bannerRef) {
          bannerRef.meta.orgSlug = organizations;
          OrgBanners.insert({
            file: bannerRef.image,
            meta: bannerRef.meta,
            onUploaded: () => {
              browserHistory.push(href);
            }
          })
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
              <ImageForm ref="profile" defaultImage={this.state.image} />
            </div>
            <div className="col col-1 x-center">
              <h5>Banner</h5>
              <ImageForm ref="banner" aspectRatio={16/9} defaultImage={this.state.banner} />
            </div>
          </div>
          <h5>Description</h5>
          <Editor ref="description" useInsert={true} usePara={true} useTable={true} />
          <div className="row center" style={{marginTop: 20}}>
            <button onClick={this.submit.bind(this)}>Create</button>
          </div>
        </div>
      </div>
    )
  }
}
