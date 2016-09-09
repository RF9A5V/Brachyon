import React, { Component } from "react";

import TabController from "./tab_controller.jsx";

import OrganizeMain from "./modules/organize/main.jsx";
import JudgePage from "./modules/organize/submodules/judges.jsx";
import StaffPage from "./modules/organize/submodules/staff.jsx";

export default class SideTabTest extends Component {

  items() {
    return [
      {
        text: "Organize",
        icon: "cog",
        subitems: [
          {
            component: OrganizeMain
          },
          {
            text: "Judges",
            component: JudgePage
          },
          {
            text: "Staff",
            component: StaffPage
          }
        ]
      },
      {
        text: "Organize",
        icon: "cog",
        subitems: [
          {
            component: OrganizeMain
          }
        ]
      },
      {
        text: "Organize",
        icon: "cog",
        subitems: [
          {
            component: OrganizeMain
          }
        ]
      },
      {
        text: "Organize",
        icon: "cog",
        subitems: [
          {
            component: OrganizeMain
          }
        ]
      }
    ]
  }

  render() {
    return (
      <TabController items={this.items()} />
    )
  }
}
