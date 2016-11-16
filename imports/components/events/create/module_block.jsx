import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";

export default class ModuleBlock extends Component {

  onModuleSelect(e) {
    e.preventDefault();
    this.props.callback();
  }

  render() {
    return (
      <VelocityComponent animation={this.props.isActive ? { backgroundColor: "#222", color: "#FF6000" } : { backgroundColor: "#666", color: "white" }} duration={300}>
        <div className={`row x-center`} onClick={this.onModuleSelect.bind(this)} style={{padding: 10, marginRight: 10}}>
          <div>
            <FontAwesome name={this.props.icon || "cog"} size="2x" />
          </div>
          <span className="module-block-header col-1">{ this.props.modName[0].toUpperCase() + this.props.modName.slice(1) }</span>
        </div>
      </VelocityComponent>
    )
  }
}
