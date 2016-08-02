import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class ModuleBlock extends Component {

  onModuleSelect(e) {
    e.preventDefault();
    this.props.callback(this.props.category, this.props.index);
  }

  render() {
    return (
      <div className={`${ this.props.isActive ? "active" : "" } module-block row x-center`} onClick={this.onModuleSelect.bind(this)}>
        <FontAwesome name="cog" size="3x" />
        <span className="module-block-header">{ this.props.modName[0].toUpperCase() + this.props.modName.slice(1) }</span>
        <div className="module-block-overlay">
          {
            this.props.isActive ? (
              <FontAwesome name="minus" />
            ) : (
              <FontAwesome name="plus" />
            )
          }

        </div>
      </div>
    )
  }
}
