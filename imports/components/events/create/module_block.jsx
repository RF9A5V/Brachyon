import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";

export default class ModuleBlock extends Component {

  onModuleSelect(e) {
    e.preventDefault();
    this.props.callback(this.props.category, this.props.index);
  }

  render() {
    return (
      <VelocityComponent animation={this.props.isActive ? { backgroundColor: "#222", color: "#FF6000" } : { backgroundColor: "#666", color: "white" }} duration={300}>
        <div className={`row x-center module-block row x-center ${this.props.isActive ? "active" : ""}`} onClick={this.onModuleSelect.bind(this)}>
          <div style={{width: "17.5%", textAlign: "center"}}>
            <FontAwesome name={this.props.icon || "cog"} size="2x" />
          </div>
          <span className="module-block-header col-1">{ this.props.modName[0].toUpperCase() + this.props.modName.slice(1) }</span>
          {
            this.props.isActive ? (
              <FontAwesome name="minus" />
            ) : (
              <FontAwesome name="plus" />
            )
          }
        </div>
      </VelocityComponent>
    )
  }
}
