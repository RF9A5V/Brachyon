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
      value: this.refs.stream.value
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
      <div style={this.props.style}>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{backgroundColor: "#333", width: 100, height: 30}} onClick={this.props.onToggle}>
            <div className="row center x-center" style={{backgroundColor: "white", width: 45, height: 20, position: "relative", left: this.props.selected ? 50 : 5}}>
              <span style={{color: "#333"}}>
                {
                  this.props.selected ? (
                    "On"
                  ) : (
                    "Off"
                  )
                }
              </span>
            </div>
          </div>
        </div>
        {
          this.props.selected ? (
            <div>
              <label>Stream</label>
              <div className="row x-center">
                <span>https://twitch.tv/</span>
                <input type="text" placeholder="Stream Name" ref="stream" />
              </div>
            </div>
          ) : (
            <div className="row">
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
      </div>
    );
  }
}
