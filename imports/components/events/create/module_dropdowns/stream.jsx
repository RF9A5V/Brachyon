import React, { Component } from "react";

export default class StreamPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0
    }
  }

  value() {
    return {
      value: streamID
    };
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
      <div className="col panel">
        <h3>Add A Stream</h3>
        <input type="text" ref="streamID" />
        <a style={{fontSize: 12}} href="#">What do I put here?</a>
      </div>
    )
  }
}
