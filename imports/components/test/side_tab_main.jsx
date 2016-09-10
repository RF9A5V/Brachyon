import React, { Component } from "react";

export default class SideTabMain extends Component {
  render() {
    var subItem = this.props.items[this.props.activeItem].subitems[this.props.activeSub];
    return (
      <div className="tab-content">
        {
          <subItem.component item={this.props.items[this.props.activeItem]} onItemSelect={this.props.onItemSelect} activeItem={this.props.activeItem} { ...(subItem.args || {}) } />
        }
      </div>
    )
  }
}
