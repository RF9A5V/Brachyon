import React, { Component } from "react";

// Note that if you're calling componentWillMount or any of the lifecycle methods, be sure to explicitly call super.method
// Spent a while chasing down some bugs related to that

// Also, avoid setting this.state directly in inherited classes, otherwise the render field in this wrapper gets overwritten

export default class ResponsiveComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const mql = window.matchMedia("(max-device-width: 480px)");
    this.setState({
      render: mql.matches ? "mobile" : "desktop"
    })
  }

  setRenderSize() {
    const mql = window.matchMedia("(max-device-width: 480px)");
    this.setState({
      render: mql.matches ? "mobile" : "desktop"
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.state.resize);
  }

  componentDidMount() {
    this.state.resize = this.setRenderSize.bind(this);
    window.addEventListener("resize", this.state.resize)
  }

  renderDesktop() {
    // To be overrided
    return null;
  }

  renderTablet() {
    // To be overrided
    return null;
  }

  renderMobile() {
    // To be overrided
    return null;
  }

  render() {
    switch(this.state.render) {
      case "mobile":
        return this.renderMobile();
      case "tablet":
        return this.renderTablet();
      case "desktop":
        return this.renderDesktop();
      default:
        return null;
    }
  }
}
