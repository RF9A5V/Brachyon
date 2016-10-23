import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LoadingScreen from "../public/loading.jsx";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import Main from "./modules/main.jsx";

import BracketMain from "./modules/bracket/edit.jsx";
import AddBracket from "./modules/bracket/add.jsx";
import EditBracket from "./modules/bracket/edit.jsx";

import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

import RevenueDetailsPage from "./modules/revenue/details.jsx";
import TicketsPage from "./modules/revenue/tickets.jsx";
import TierPage from "./modules/revenue/tiers.jsx";
import StrategyPage from "./modules/revenue/strategies.jsx";
import RewardsPage from "./modules/revenue/rewards.jsx";

import StaffPage from "./modules/organize/staff.jsx";
import SchedulePage from "./modules/organize/schedule.jsx";

import SubmitPage from "./modules/submit.jsx";
import PrizePoolBreakdown from "./edit/prize_pool.jsx";

import EditModulePage from "./modules/edit_modules.jsx";

export default class EditEventScreen extends TrackerReact(React.Component){

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.eventId)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  detailItems() {
    return {
      text: "Details",
      icon: "file-text",
      subitems: [
        {
          component: Main,
          args: {
            name: "Details"
          }
        },
        {
          component: DescriptionPage,
          text: "Description"
        },
        {
          component: LocationPage,
          text: "Location"
        },
        {
          component: DatetimePage,
          text: "Date and Time"
        },
        {
          component: ImagePage,
          text: "Event Image"
        }
      ]
    }
  }

  bracketItems(event) {
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
      ].concat((event.brackets ? (
        event.brackets.map((bracket, index) => {
          return {
            component: EditBracket,
            text: bracket.name,
            args: {
              index,
              bracket
            }
          }
        })
      ) : (
        []
      ))).concat(event.brackets.length == 0 ? [
        {
          component: AddBracket,
          text: "Add Bracket"
        }
      ] : []).concat(
        event.brackets && event.brackets.length > 0 ? [
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
      text: "Edit Modules",
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
    // Rearrange order rendered in side tabs by changing the item index in the item array.
    var items = [
      this.detailItems()
    ];
    if(event.brackets) {
      items.push(this.bracketItems(event));
    }
    if(event.crowdfunding) {
      items.push(this.crowdfundingItems());
    }
    if(event.tickets) {
      items.push(this.ticketItems());
    }
    if(event.organize) {
      items.push(this.organizeItems());
    }
    items.push(this.submitItem());
    items.push(this.editItem(items.length + 1));
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
        <TabController items={this.items()} />
      )
    }
  }
}
