import React, { Component } from "react";

export default class ResponsiveComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      render: "desktop"
    };
  }

  setRenderSize() {
    const mql = window.matchMedia("(max-device-width: 480px)");
    if(mql.matches) {
      this.setState({
        render: "mobile"
      })
    }
    // else if(window.matchMedia("only screen and (min-width: 400px and max-width: 800px)")) {
    //   this.setState({
    //     render: "desktop" // Should be tablet in future
    //   })
    // }
    else {
      this.setState({
        render: "desktop"
      })
    }
  }

  componentWillMount() {
    this.setRenderSize();
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
