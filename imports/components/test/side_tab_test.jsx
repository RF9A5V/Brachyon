import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "./tab_controller.jsx";

import Main from "./modules/main.jsx";

import StaffPage from "./modules/organize/staff.jsx";

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

export default class SideTabTest extends TrackerReact(Component) {

  constructor(){
    super();
    this.state = {
      event: Meteor.subscribe("event", "Eb4tWi7MYh9MnAYo9")
    }
  }

  items() {
    var event = Events.findOne();
    return [
      {
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
          }
        ]
      },
      {
        text: "Brackets",
        icon: "gamepad",
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
        ))).concat([
          {
            component: AddBracket,
            text: "Add Bracket"
          }
        ])
      },
      {
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
            text: "Banner"
          }
        ]
      },
      {
        text: "Revenue",
        icon: "money",
        subitems: [
          {
            component: Main,
            args: {
              name: "Revenue"
            }
          },
          {
            component: RevenueDetailsPage,
            text: "Details"
          },
          {
            component: TicketsPage,
            text: "Tickets"
          },
          {
            component: TierPage,
            text: "Tiers"
          }
        ]
      }
    ]
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <div>
          Loading
        </div>
      )
    }
    return (
      <TabController items={this.items()} />
    )
  }
}
