import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class StreamPanel extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      item: 0
    }
  }

  value() {
    return this.refs.stream.value;
  }

  itemDescriptions(opts) {
    var descriptions = [
      "Simply enter your Twitch name and we will generate a page on your event for your stream."
    ];
    return descriptions[this.state.item].split("\n").map(item => {
      return (
        <p style={{fontSize: opts.fontSize}}>
          {
            item
          }
        </p>
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
    else{}
    var active = this.props.status;
    return (
      <div>
        <div className="row flex-pad" style={{marginBottom: 10}}>
          <div>
          </div>
          <div className="row x-center" style={{cursor: "pointer", backgroundColor: "#333", width: 100, height: 30}} onClick={() => { this.props.setStatus(!active) }}>
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
                <span style={{marginRight: 2, fontSize: opts.fontSize}}>https://twitch.tv/</span>
                <input className={opts.inputClass} type="text" placeholder="Stream Name" ref="stream" />
              </div>
            </div>
          ) : (
            <div className="row">
            <div className="col col-1 center x-center info-description">
              <h3 style={{fontSize: opts.fontSize}}>{ tabs[this.state.item] }</h3>
              <div style={{width: opts.descWidth}} className="row center">
                {
                  this.itemDescriptions(opts)
                }
              </div>
              <div className="row col-1"></div>
              <button className={opts.buttonClass} style={{margin: "0 auto"}} onClick={() => { this.props.setStatus(!active) }}>Create a Stream</button>
            </div>
          </div>
          )
        }
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em",
      inputClass: "large-input",
      buttonClass: "large-button",
      descWidth: "80%"
    })
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      inputClass: "",
      buttonClass: "",
      descWidth: "50%"
    })
  }

}
