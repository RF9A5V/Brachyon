import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import Main from "./modules/main.jsx";

import OverviewMain from "./admin/modules/overview/main.jsx";

import CrowdfundingMain from "./admin/modules/crowdfunding/main.jsx";
import TierBreakdown from "./admin/modules/crowdfunding/tiers.jsx";

import BracketsMain from "./admin/modules/brackets/main.jsx";

import PromotionMain from "./admin/modules/promotion/main.jsx";
import FeaturedList from "./admin/modules/promotion/featured.jsx";
import SocialMedia from "./admin/modules/promotion/social_media.jsx";

import Staff from "./modules/organize/staff.jsx";
import Schedule from "./modules/organize/schedule.jsx";

import Unpublish from "./admin/modules/unpublish.jsx";

import EditModules from "./admin/modules/edit_modules.jsx";

export default class EventAdminPage extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.eventId)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  items() {
    var event = Events.findOne();
    var items = [
      {
        text: "Overview",
        icon: "globe",
        subitems: [
          {
            component: OverviewMain
          }
        ]
      }
    ];
    if(event.crowdfunding) {
      items.push({
        text: "Crowdfunding",
        icon: "usd",
        subitems: [
          {
            component: Main,
            args: {
              name: "Crowdfunding"
            }
          },
          {
            component: TierBreakdown,
            text: "Tiers"
          }
        ]
      });
    }
    if(event.brackets) {
      items.push({
        text: "Brackets",
        icon: "sitemap",
        subitems: [
          {
            component: BracketsMain
          }
        ]
      });
    }
    if(event.promotion){
      items.push({
        text: "Promotion",
        icon: "arrow-up",
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
      });
    }
    if(event.organize){
      items.push({
        text: "Organize",
        icon: "bullhorn",
        subitems: [
          {
            component: Main,
            args: {
              name: "Organize"
            }
          },
          {
            text: "Schedule",
            component: Schedule
          }
        ]
      })
    }
    items.push({
      text: "Edit",
      subitems: [
        {
          component: EditModules
        }
      ]
    });
    if(event.crowdfunding && event.crowdfunding.sponsors && event.crowdfunding.sponsors.length == 0) {
      items.push({
        text: "Unpublish",
        subitems: [
          {
            component: Unpublish
          }
        ]
      });
    }
    return items;
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
