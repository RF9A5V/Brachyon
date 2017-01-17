import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer/footer.jsx';
import { Session } from 'meteor/session';

import { VelocityComponent } from "velocity-react";

import moment from 'moment';

export default class MainLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false,
      component: this.props.children
    };
  }

  componentWillUnmount() {
    this.setState({
      fadeIn: false
    });
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

  render() {
    return (
      <div>
        <Header ref="header" onLoad={this.onHeaderLoaded.bind(this)} />
        <VelocityComponent animation={{opacity: this.state.fadeIn ? 1 : 0}} duration={400}>
          <div className="box row content">
            { this.state.component }
          </div>
        </VelocityComponent>
        <VelocityComponent animation={{top: this.state.fadeIn ? 0 : 40}} duration={400}>
          <Footer />
        </VelocityComponent>
      </div>
    )
  }
}
