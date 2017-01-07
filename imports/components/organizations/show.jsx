import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import { browserHistory } from "react-router";

import Organizations from "/imports/api/organizations/organizations.js";

import BlockContainer from "/imports/components/events/discover/block_container.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class PreviewEventScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props)

    this.state = {
      organization: Meteor.subscribe("getOrganizationBySlug", props.params.slug, {
        onReady: () => {
          this.setState({
            isReady: true
          })
        },
        isReady: false,
        hasLoaded: false
      })
    }
  }

  componentWillUnmount(){
    this.state.organization.stop();
  }

  org() {
    return Organizations.find().fetch()[0];
  }

  profileBannerURL(id) {
    var org = this.org();
    return org.details.bannerUrl ? org.details.bannerUrl : "/images/bg.jpg";

  }

  profileImage() {
    var org = this.org();
    return org.details.profileUrl ? org.details.profileUrl : "/images/profile.png";
  }

  render() {
    if(!this.state.isReady){
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div className="box">
        <div className="user-banner" style={{backgroundImage: `url(${this.profileBannerURL()})`}}>
          <div className="user-img-line row flex-pad x-center">
            <div className="row col-1">
            </div>
            <div className="user-profile-image">
              <img src={this.profileImage()} style={{width: "100%", height: "100%", borderRadius: "100%"}} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
