import React, { Component } from "react";

export default class StreamPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0
    }
  }

  value() {
    return {};
  }

  itemTabs() {
    var values = ["Chat", "Video"];
    return (
      <div className="info-title-container">
        {
          values.map((value, i) => {
            return (
              <div className={`info-title ${this.state.item == i ? "active" : ""}`} onClick={() => { this.setState({ item: i }) }}>
                { value }
              </div>
            )
          })
        }
      </div>
    )
  }

  itemDescriptions() {
    var descriptions = [
      "Intuition is fucking important. The details are not the details. They make the fucking design. Why are you fucking reading all of this? Get back to work. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user.",
      "Intuition is fucking important. The details are not the details. They make the fucking design. Why are you fucking reading all of this? Get back to work. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user."
    ];
    return descriptions[this.state.item].split("\n").map(item => {
      return (
        <p>
          {
            item
          }
        </p>
      )
    });
  }

  render() {
    var tabs = ["Chat", "Video"];
    return (
      <div className="row panel">
        {
          this.itemTabs()
        }
        <div className="col col-1 info-description">
          <div className="row center">
          <h3>{ tabs[this.state.item] }</h3>
          </div>
          {
            this.itemDescriptions()
          }
        </div>
      </div>
    )
  }
}
