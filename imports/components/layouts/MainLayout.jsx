import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer/footer.jsx';
import { Session } from 'meteor/session';
import { VelocityComponent } from "velocity-react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import moment from 'moment';

export default class MainLayout extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false,
      component: this.props.children
    };
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
    });
    window.removeEventListener("resize", this.resize);
  }

  onHeaderLoaded() {
    this.setState({
      fadeIn: true
    });
  }

  onBodyClick() {
    this.refs.header.removeNotifications();
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
        })
      }, 200)
    }, 400)
  }

  renderBase(opts) {
    return (
      <div>
        <Header ref="header" onLoad={this.onHeaderLoaded.bind(this)} />
        <VelocityComponent animation={{opacity: this.state.fadeIn ? 1 : 0}} duration={400}>
          <div className="box row content" style={{minHeight: opts.height}}>
            { this.state.component }
          </div>
        </VelocityComponent>
        <VelocityComponent animation={{top: this.state.fadeIn ? 0 : 40}} duration={400}>
          <Footer />
        </VelocityComponent>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      height: "calc(100vh - 50px)"
    });
  }

  renderMobile() {
    return this.renderBase({
      height: window.innerHeight - 126
    });
  }

}
