import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";

export default class ModuleBlock extends Component {

  constructor(props) {
    super(props);
    this.state={active: props.isActive};
  }

  onModuleSelect(e) {
    e.preventDefault();
    this.props.callback();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.isActive
    })  
  }

  render() {
    return (
      <VelocityComponent animation={this.state.active ? { backgroundColor: "#222" } : { backgroundColor: "#666" }} duration={300}>
        <div className={`row x-center`} 
          onClick={this.onModuleSelect.bind(this)} 
          style={{width: 164, padding: 10, marginRight: 10, cursor: "pointer"}}
        > 
          <VelocityComponent animation={this.state.active ? { color: "#FF6000" } : { color: "white" }} duration={300}> 
              <FontAwesome name={this.props.icon || "cog"} size="2x" />
          </VelocityComponent>
          <VelocityComponent animation={this.state.active ? { color: "#FF6000" } : { color: "white" }} duration={300}> 
            <span className="module-block-header col-1">{ this.props.modName[0].toUpperCase() + this.props.modName.slice(1) }</span>
          </VelocityComponent>
        </div>
      </VelocityComponent>
    )
  }
}
