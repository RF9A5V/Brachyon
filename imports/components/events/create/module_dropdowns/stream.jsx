import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class StreamPanel extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      item: 0,
      stream: ""
    }
  }

  value() {
    if(this.refs.stream.value == "") {
      toastr.error("Can't have an empty stream!");
      throw new Error("Stream cannot be empty string.");
    }
    return this.refs.stream.value;
  }

  itemDescriptions(opts) {
    var descriptions = [
      "Simply enter your Twitch name and we will generate a page on your event for your stream."
    ];
    return descriptions[this.state.item].split("\n").map(item => {
      return (
        <div className="text-description border-blue" style={{fontSize: opts.fontSize, width: opts.fontWidth}}>
          {
            item
          }
        </div>
      )
    });
  }

  renderBase(opts) {
    var tabs = ["Stream"];
    if(window.location.pathname == "/events/create"){
      var eColor = "#00BDFF";
      var fColor = "#333";
    }
    else if(window.location.pathname == "/leagues/create"){
      var eColor = "#FF6000";
      var fColor = "#FFF";
    }
    var active = this.props.status;
    return (
      <div>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center module-toggle" onClick={() => { this.props.setStatus(!active) }}>
            <div className="row center x-center" style={{backgroundColor: active ? eColor : "white", width: 45, height: 20, position: "relative", left: active ? 50 : 5}}>
              <span style={{color: active ? fColor : "#333", fontSize: 12}}>
                {
                  active ? (
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
          active ? (
            <div>
              <div className="row center x-center">
                <span style={{marginRight: 2}}>https://twitch.tv/</span>
                <input type="text" placeholder="Stream Name" ref="stream" defaultValue={this.state.stream} />
              </div>
            </div>
          ) : (
            this.itemDescriptions(opts)
          )
        }
      </div>
    );
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      fontWidth: "50%"
    })
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "3em",
      fontWidth: "100%"
    })
  }
}
