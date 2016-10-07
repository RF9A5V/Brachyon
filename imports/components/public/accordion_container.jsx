import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

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
        {
          <div className="accordion-content" style={{
            display: this.props.open ? "inherit" : "none"
          }}>
            { this.props.children }
          </div>
        }
      </div>
    )
  }
}
