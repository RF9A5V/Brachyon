import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import Main from "./modules/main.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import OverviewMain from "./admin/modules/overview/main.jsx";

import CrowdfundingMain from "./admin/modules/crowdfunding/main.jsx";
import TierBreakdown from "./admin/modules/crowdfunding/tiers.jsx";

// Details stuff
import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

import BracketsMain from "./admin/modules/brackets/main.jsx";
import AddBracket from "./modules/bracket/add.jsx";
import EditBracket from "./modules/bracket/edit.jsx";

import PromotionMain from "./admin/modules/promotion/main.jsx";
import FeaturedList from "./admin/modules/promotion/featured.jsx";
import SocialMedia from "./admin/modules/promotion/social_media.jsx";

import Staff from "./modules/organize/staff.jsx";
import Schedule from "./modules/organize/schedule.jsx";

import Unpublish from "./admin/modules/unpublish.jsx";
import EditModules from "./admin/modules/edit_modules.jsx";
import Close from "./admin/modules/close_event.jsx";

import Brackets from "/imports/api/brackets/brackets.js"
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js"

export default class EventAdminPage extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug),
      rewards: Meteor.subscribe("rewards", this.props.params.slug)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
    this.state.rewards.stop();
  }


  detailItems() {
    return {
      name: "Details",
      icon: "file",
      key: "details",
      subItems: [
        {
          name: "Description",
          key: "description",
          content: (
            DescriptionPage
          )
        },
        {
          name: "Location",
          key: "location",
          content: (
            LocationPage
          )
        },
        {
          name: "Date",
          key: "datetime",
          content: (
            DatetimePage
          )
        },
        {
          name: "Banner",
          key: "image",
          content: (
            ImagePage
          ),
          args: {
            aspectRatio: 16/9
          }
        }
      ]
    }
  }

  items() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    var items = [];
    items.push(this.detailItems());
    // if(event.crowdfunding) {
    //   items.push({
    //     text: "Crowdfunding",
    //     icon: "usd",
    //     subitems: [
    //       {
    //         component: Main,
    //         args: {
    //           name: "Crowdfunding"
    //         }
    //       },
    //       {
    //         component: TierBreakdown,
    //         text: "Tiers"
    //       }
    //     ]
    //   });
    // }
    if(instance.brackets) {
      var subs = Instances.findOne().brackets.map((b,i) => {
        return {
          name: b.name || `Bracket ${i + 1}`,
          key: i,
          content: EditBracket,
          args: {
            bracket: b
          }
        }
      });
      subs.push({
        content: AddBracket,
        name: "Add Bracket",
        key: "add"
      });
      items.push({
        name: "Brackets",
        icon: "sitemap",
        key: "brackets",
        subItems: subs
      });
    }
    // if(event.promotion){
    //   items.push({
    //     text: "Promotion",
    //     icon: "arrow-up",
    //     subitems: [
    //       {
    //         component: Main,
    //         args: {
    //           name: "Promotion"
    //         }
    //       },
    //       {
    //         text: "Featured",
    //         component: FeaturedList
    //       },
    //       {
    //         text: "Social Media",
    //         component: SocialMedia
    //       }
    //     ]
    //   });
    // }
    return items;
  }

  save() {
    var attrs = this.refs.editor.value();
    var event = Events.findOne();

    var details = attrs.details;

    // I know, but bear with me.
    // This is getting refactored in like a month anyways.
    details.name = details.description.name;
    details.description = details.description.description;

    Object.keys(event.details).forEach(k => {
      if(event.details[k] == details[k]) {
        delete details[k];
      }
    });

    var imgTemp;
    if(details.image != null) {
      var file = attrs.details.image.image;
      imgTemp = JSON.parse(JSON.stringify(attrs.details.image));
      imgTemp.image = file;
    }
    delete attrs.details.image;

    if(attrs.creator.id == event.owner) {
      delete attrs.creator;
    }
    Meteor.call("events.edit", event._id, attrs, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
    });
    if(imgTemp) {
      imgTemp.meta.eventSlug = event.slug;
      Banners.insert({
        file: imgTemp.image,
        meta: imgTemp.meta,
        onUploaded: (err, data) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
        }
      })
    }
  }

  actions() {
    return [
      {
        name: "Save All",
        action: this.save.bind(this)
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
      <div className="box col" style={{padding: 40}}>
        <CreateContainer ref="editor" items={this.items()} actions={this.actions()} />
      </div>
    )
  }
}
