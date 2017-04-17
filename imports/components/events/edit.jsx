import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LoadingScreen from "../public/loading.jsx";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import Main from "./modules/main.jsx";

import BracketMain from "./modules/bracket/edit.jsx";
import AddBracket from "./modules/bracket/add.jsx";
import EditBracket from "./modules/bracket/edit.jsx";

import Title from "./create/title.jsx";
import ImageForm from "../public/img_form.jsx";
import Editor from "../public/editor.jsx";
import DateTimeSelector from "../public/datetime_selector.jsx";
import Location from "../events/create/location_select.jsx";

import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

import RevenueDetailsPage from "./modules/revenue/details.jsx";
import TicketsPage from "./modules/revenue/tickets.jsx";
import TierPage from "./modules/revenue/tiers.jsx";
import StrategyPage from "./modules/revenue/strategies.jsx";
import RewardsPage from "./modules/revenue/rewards.jsx";
import AddStream from "./modules/stream/add.jsx";

import StaffPage from "./modules/organize/staff.jsx";
import SchedulePage from "./modules/organize/schedule.jsx";

import SubmitPage from "./modules/submit.jsx";
import PrizePoolBreakdown from "./edit/prize_pool.jsx";

import EditModulePage from "./modules/edit_modules.jsx";

import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

export default class EditEventScreen extends TrackerReact(React.Component){

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  detailItems() {
    const event = Events.findOne();
    return {
      text: "Details",
      icon: "file-text",
      subitems: [
        {
          component: Title,
          text: "Overview",
          args: {
            name: "Details"
          }
        },
        {
          component: Editor,
          text: "Description",
          args: {
            value: event.details.description
          }
        },
        {
          component: Location,
          args: {
            ...event.details.location
          }
        },
        {
          component: DatetimeSelector,
          args: {
            init: event.details.datetime
          }
        },
        {
          component: ImageForm,
          args: {
            url: event.details.bannerUrl
          }
        }
      ]
    }
  }

  bracketItems() {
    var instance = Instances.findOne();
    return {
      text: "Brackets",
      icon: "sitemap",
      subitems: [
        {
          component: Main,
          args: {
            name: "Brackets"
          }
        }
      ].concat((instance.brackets ? (
        instance.brackets.map((bracket, index) => {
          return {
            component: EditBracket,
            text: Games.findOne(bracket.game).name,
            args: {
              index,
              bracket
            }
          }
        })
      ) : (
        []
      ))).concat(instance.brackets.length >= 0 ? [
        {
          component: AddBracket,
          text: "Add Bracket"
        }
      ] : []).concat(
        instance.brackets && instance.brackets.length && false > 0 ? [ // Disabling this for alpha
          {
            component: PrizePoolBreakdown,
            text: "Prize Pool"
          }
        ] : []
      )
    };
  }

  crowdfundingItems() {
    var event = Events.findOne();
    var subitems = [
      {
        component: Main,
        args: {
          name: "Crowdfunding"
        }
      },
      {
        component: RevenueDetailsPage,
        text: "Details"
      },
      {
        component: RewardsPage,
        text: "Rewards"
      },
      {
        component: TierPage,
        text: "Tiers"
      }
    ];
    return {
      text: "Crowdfunding",
      icon: "usd",
      subitems
    };
  }

  ticketItems() {
    return {
      text: "Tickets",
      icon: "ticket",
      subitems: [
        {
          component: TicketsPage
        }
      ]
    };
  }

  organizeItems() {
    return {
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
          text: "Staff",
          component: StaffPage
        },
        {
          text: "Schedule",
          component: SchedulePage
        }
      ]
    };
  }

  streamItem() {
    return {
      icon: "video-camera",
      text: "Stream",
      subitems: [
        {
          component: AddStream
        }
      ]
    };
  }

  submitItem() {
    return {
      text: "Submit",
      subitems: [
        {
          component: SubmitPage
        }
      ]
    };
  }

  editItem(itemCount) {
    return {
      text: "+/- Modules",
      subitems: [
        {
          component: EditModulePage,
          args: {
            count: itemCount
          }
        }
      ]
    };
  }

  items() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    // Rearrange order rendered in side tabs by changing the item index in the item array.
    var items = [
      this.detailItems()
    ];
    if(instance.brackets) {
      items.push(this.bracketItems());
    }
    // if(event.crowdfunding) {
    //   items.push(this.crowdfundingItems());
    // }
    // if(instance.tickets) {
    //   items.push(this.ticketItems());
    // }
    if(event.organize) {
      items.push(this.organizeItems());
    }
    items.push(this.submitItem());
    items.push(this.editItem(items.length + 1));
    items.push(this.streamItem());
    return items;
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <LoadingScreen />
      )
    }
    else {
      return (
        <div className="box">
        <TabController items={this.items()} />
        </div>
      )
    }
  }
}
