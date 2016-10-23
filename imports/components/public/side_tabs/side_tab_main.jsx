import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";

export default class SideTabMain extends Component {

  constructor(props){
    super(props);
  }

  render() {
    var subItem = this.props.items[this.props.activeItem].subitems[this.props.activeSub];
    return (
      <div className="tab-content col">
        <div style={{textAlign: "center"}}>
          <h2 style={{display: "inline-block"}}>{this.props.items[this.props.activeItem].text}</h2>
        </div>
        <div className="col-1">
          {
            <subItem.component item={this.props.items[this.props.activeItem]} onItemSelect={this.props.onItemSelect} activeItem={this.props.activeItem} { ...(subItem.args || {}) } />
          }
        </div>
      </div>
    )
  }
}
