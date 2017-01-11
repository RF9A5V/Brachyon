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
    if(window.location.pathname == "/events/create"){
      var eColor = "#00BDFF";
    }
    else if(window.location.pathname == "/leagues/create"){
      var eColor = "#FF6000";
    }
    else{}
    return (
      <VelocityComponent animation={this.state.active ? { backgroundColor: "#222" } : { backgroundColor: "#666" }} duration={300}>
        <div className={`row x-center`}
          onClick={this.onModuleSelect.bind(this)}
          style={{width: 164, padding: 10, marginRight: 10, cursor: "pointer"}}
        >
          <FontAwesome name={this.props.icon || "cog"} size="2x" />
          <span className="module-block-header col-1">{ this.props.modName[0].toUpperCase() + this.props.modName.slice(1) }</span>
          {
            this.props.toggleable ? (
              ""
            ) : (
              <div className="col mod-block-toggle" style={{justifyContent: this.props.isOn ? "flex-start" : "flex-end"}} onClick={() => { this.props.onToggle() }}>
                <div className="mod-block-control" style={{backgroundColor: this.props.isOn ? eColor : "white"}}></div>
              </div>
            )
          }
        </div>
      </VelocityComponent>
    )
  }
}
