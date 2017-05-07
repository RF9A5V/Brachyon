import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";

import Header from '../public/header.jsx';
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class NoFooterLayout extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false
    }
    this.resize = () => {
      if(this.state.render == "mobile") {
        this.forceUpdate();
      }
    }
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.setState({
      fadeIn: false
    })
    window.removeEventListener("resize", this.resize);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setState({
      fadeIn: true
    })
  }

  componentWillReceiveProps(next) {
    this.setState({
      fadeIn: false,
      component: this.props.children
    });
    setTimeout(() => {
      this.setState({
        component: next.children
      });
      setTimeout(() => {
        this.setState({
          fadeIn: true
        });
      }, 400)
    }, 400)
  }

  renderBase(opts) {
    return (
      <div>
        <Header ref="header" onLoad={() => { this.setState({ fadeIn: true }) }} />
        <VelocityComponent animation={{opacity: this.state.fadeIn ? 1 : 0}} duration={400}>
          <div className="box col" style={{minHeight: opts.height}}>
            { this.props.children }
          </div>
        </VelocityComponent>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      height: `calc(100vh - 50px)`
    })
  }

  renderMobile() {
    return this.renderBase({
      height: window.innerHeight - 126
    })
  }
}
