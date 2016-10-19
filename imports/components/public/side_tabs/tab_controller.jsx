import React, { Component } from "react";

import SideTabMenu from "./side_tab_menu.jsx";
import SideTabContent from "./side_tab_main.jsx";
import { VelocityComponent } from "velocity-react";

export default class TabController extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0,
      activeSub: 0,
      isAnimating: false
    }
  }

  setActive(item, subItem){
    this.setState({
      isAnimating: true
    });
    setTimeout(() => {
      this.setState({
        activeItem: item,
        activeSub: subItem,
        isAnimating: false
      })
    }, 500)
  }

  persistentButtons() {
    return this.props.items.filter(item => {
      return item.icon == null;
    }).reverse();
  }

  onPersistentButtonClick(item) {
    var index = this.props.items.indexOf(item);
    this.setActive(index, 0);
  }

  render() {
    return (
      <div className="tab-container row">
        <SideTabMenu items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} />
        <VelocityComponent animation={{opacity: this.state.isAnimating ? 0 : 1}} duration={500}>
          <SideTabContent items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} />
        </VelocityComponent>
        <div className="row x-center" style={{position: "fixed", bottom: 0, width: "100%", height: 50, backgroundColor: "#111", zIndex: 4, paddingLeft: 10}}>
          {
            this.persistentButtons().map((item, i) => {
              return (
                <span style={{margin: 10}} onClick={() => { this.onPersistentButtonClick(item) }}>
                  { item.text }
                </span>
              )
            })
          }
        </div>
      </div>
    )
  }
}
