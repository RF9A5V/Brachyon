import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { VelocityComponent } from "velocity-react";

export default class AccordionContainer extends Component {

  onClick(e) {
    e.preventDefault();
    this.props.handler();
  }

  render() {
    return (
      <div className="accordion-container">
        <div className="accordion-header" onClick={this.onClick.bind(this)}>
          <h5>
            { this.props.title }
          </h5>
          {
            this.props.open ? (
              <FontAwesome name="caret-up" size="2x" />
            ) : (
              <FontAwesome name="caret-down" size="2x" />
            )
          }

        </div>
        <VelocityComponent animation={this.props.open ? { height: 500, padding: "0 20px" } : { height: 0, padding: 0 }}>
        {
          <div className="accordion-content" style={{
            height: 0, padding: 0
          }}>
            { this.props.children }
          </div>
        }
        </VelocityComponent>
      </div>
    )
  }
}
