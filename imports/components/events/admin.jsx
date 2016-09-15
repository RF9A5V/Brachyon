import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import Main from "./modules/main.jsx";

import OverviewMain from "./admin/modules/overview/main.jsx";
import CrowdfundingMain from "./admin/modules/crowdfunding/main.jsx";
import BracketsMain from "./admin/modules/brackets/main.jsx";

import PromotionMain from "./admin/modules/promotion/main.jsx";
import FeaturedList from "./admin/modules/promotion/featured.jsx";
import SocialMedia from "./admin/modules/promotion/social_media.jsx";

export default class EventAdminPage extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.eventId)
    }
  }

  items() {
    return [
      {
        text: "Overview",
        icon: "globe",
        subitems: [
          {
            component: OverviewMain
          }
        ]
      },
      {
        text: "Crowdfunding",
        icon: "money",
        subitems: [
          {
            component: CrowdfundingMain
          }
        ]
      },
      {
        text: "Brackets",
        icon: "sitemap",
        subitems: [
          {
            component: BracketsMain
          }
        ]
      },
      {
        text: "Promotion",
        icon: "exclamation",
        subitems: [
          {
            component: Main,
            args: {
              name: "Promotion"
            }
          },
          {
            text: "Featured",
            component: FeaturedList
          },
          {
            text: "Social Media",
            component: SocialMedia
          }
        ]
      }
    ]
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div className="box col">
        <TabController items={this.items()} />
      </div>
    )
  }
}
