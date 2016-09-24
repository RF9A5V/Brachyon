import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LoadingScreen from "../public/loading.jsx";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

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
import StrategyPage from "./modules/revenue/strategies.jsx";
import RewardsPage from "./modules/revenue/rewards.jsx";

import SubmitPage from "./modules/submit.jsx";

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
      },
      {
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
        ))).concat([
          {
            component: AddBracket,
            text: "Add Bracket"
          }
        ])
      },
      {
        text: "Revenue",
        icon: "usd",
        subitems: [
          {
            component: Main,
            args: {
              name: "Revenue"
            }
          },
          {
            component: RevenueDetailsPage,
            text: "Crowdfunding"
          },
          {
            component: RewardsPage,
            text: "Rewards"
          },
          {
            component: TierPage,
            text: "Tiers"
          },
          {
            component: StrategyPage,
            text: "Strategies"
          },
          {
            component: TicketsPage,
            text: "Tickets"
          }
        ]
      },
      {
        text: "Submit",
        icon: "check",
        subitems: [
          {
            component: SubmitPage
          }
        ]
      }
    ]
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
