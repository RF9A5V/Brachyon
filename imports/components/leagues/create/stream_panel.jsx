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

  itemDescriptions() {
    var descriptions = [
      "Simply enter your Twitch name and we will generate a page on your event for your stream."
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
    var tabs = ["Stream"];
    return (
      <div style={this.props.style}>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{cursor: "pointer", backgroundColor: "#333", width: 100, height: 30}} onClick={this.props.onToggle}>
            <div className="row center x-center" style={{backgroundColor: this.props.selected ? "#FF6000" : "white", width: 45, height: 20, position: "relative", left: this.props.selected ? 50 : 5}}>
              <span style={{color: this.props.selected ? "#FFF" : "#333", fontSize: 12}}>
                {
                  this.props.selected ? (
                    "ON"
                  ) : (
                    "OFF"
                  )
                }
              </span>
            </div>
          </div>
        </div>
        {
          this.props.selected ? (
            <div>
              <div className="row center x-center">
                <span style={{marginRight: 2}}>https://twitch.tv/</span>
                <input type="text" placeholder="Stream Name" ref="stream" defaultValue={(this.props.attrs.stream || {}).value} onChange={(e) => {
                  if(!this.props.attrs.stream) {
                    this.props.attrs.stream = { value: e.target.value };
                  } else {
                    this.props.attrs.stream.value = e.target.value;
                  }
                }}  />
              </div>
            </div>
          ) : (
            <div className="row">
            <div className="col col-1 info-description">
              <div className="row center">
              <h3>{ tabs[this.state.item] }</h3>
              </div>
              <div style={{margin: "20px 25vw"}} className="row center">
                {
                  this.itemDescriptions()
                }
              </div>
              <div className="row col-1"></div>
              <button style={{margin: "0 auto"}} onClick={this.props.onToggle}>Create a Stream</button>
            </div>
          </div>
          )
        }
      </div>
    );
  }
}
