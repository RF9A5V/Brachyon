import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class GameResultTemplate extends ResponsiveComponent {

  onClick(e) {
    e.preventDefault();
    this.props.onClick(this.props, this.props.name);
  }

  renderBase(opts) {
    return (
      <div className="game-result-template row x-center" style={{marginBottom:0}}onClick={this.onClick.bind(this)}>
        <img src={this.props.bannerUrl} style={{width: opts.width, height: `calc(${opts.width} * 4 / 3)`}} />
        <span style={{marginLeft: 10, fontSize: opts.fontSize}}>
          { this.props.name }
        </span>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      width: "100px"
    });
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "3em",
      width: "200px"
    });
  }

}
