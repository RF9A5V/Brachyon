import React, { Component } from "react";

import SideTabMenu from "./side_tab_menu.jsx";
import SideTabContent from "./side_tab_main.jsx";

export default class TabController extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0,
      activeSub: 0
    }
  }

  setActive(item, subItem){
    this.setState({
      activeItem: item,
      activeSub: subItem
    })
  }

  render() {
    return (
      <div className="tab-container row">
        <SideTabMenu items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} />
        <SideTabContent items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} />
      </div>
    )
  }
}
