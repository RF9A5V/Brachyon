import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class ModuleBlock extends Component {

  onModuleSelect(e) {
    e.preventDefault();
    this.props.callback(this.props.category, this.props.index);
  }

  render() {
    return (
      <div className={`row x-center ${ this.props.isActive ? "active" : "" } module-block row x-center`} onClick={this.onModuleSelect.bind(this)}>
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
    )
  }
}
