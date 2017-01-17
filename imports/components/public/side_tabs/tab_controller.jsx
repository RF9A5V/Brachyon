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
    if(this.state.activeItem == item) {
      this.setState({activeItem: item, activeSub: subItem});
      return;
    }
    this.setState({
      isAnimating: true
    });
    setTimeout(() => {
      this.setState({
        activeItem: item,
        activeSub: subItem,
        isAnimating: false
      });
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

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activeItem != this.state.activeItem || nextState.activeSub != this.state.activeSub
  }

  render() {
    var buttons = this.persistentButtons();
    return (
      <div className="tab-container">
        <SideTabMenu items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} componentHeader={this.props.componentHeader} />
        <VelocityComponent animation={{opacity: this.state.isAnimating ? 0 : 1}} duration={500}>
          <SideTabContent items={this.props.items} activeItem={this.state.activeItem} activeSub={this.state.activeSub} onItemSelect={this.setActive.bind(this)} update={this.props.update} />
        </VelocityComponent>
        <div className="row x-center" style={{position: "fixed", bottom: 0, width: "100%", height: 50, backgroundColor: "#111", zIndex: 4, paddingRight: 80, justifyContent: "flex-end"}}>
          {
            buttons.map((item, i) => {
              return (
                <button className={i == buttons.length - 1 ? "signup-button" : "login-button" } style={{margin: 10}} onClick={() => { this.onPersistentButtonClick(item) }}>
                  { item.text }
                </button>
              )
            })
          }
        </div>
      </div>
    )
  }
}
