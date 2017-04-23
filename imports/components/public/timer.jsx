import React, { Component } from "react";
import moment from "moment";
import countdown from "countdown";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Timer extends ResponsiveComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    super.componentWillMount();
    this.intervalId = setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearInterval(this.intervalId);
  }

  render() {
    const { hours, minutes, seconds } = countdown(new Date(this.props.date), new Date(), countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
    const str = [hours, minutes, seconds].map(t => {
      return t < 10 ? "0" + t : t;
    }).join(":");
    return (
      <span>
        { str }
      </span>
    )
  }
}
