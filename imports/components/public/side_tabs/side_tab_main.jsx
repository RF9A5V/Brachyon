import React, { Component } from "react";

export default class SideTabMain extends Component {

  constructor(props){
    super(props);
    console.log(props);
  }

  render() {
    var subItem = this.props.items[this.props.activeItem].subitems[this.props.activeSub];
    return (
      <div className="tab-content">
        <div className="row center">
          <h2>{this.props.items[this.props.activeItem].text}</h2>
        </div>
        {
          <subItem.component item={this.props.items[this.props.activeItem]} onItemSelect={this.props.onItemSelect} activeItem={this.props.activeItem} { ...(subItem.args || {}) } />
        }
      </div>
    )
  }
}
