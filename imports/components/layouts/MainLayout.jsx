import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer/footer.jsx';
import { Session } from 'meteor/session';

import moment from 'moment';

require('velocity-animate');
import { VelocityComponent } from "velocity-react";
require('velocity-animate/velocity.ui');

Session.set('patchUpdate', 'session value test');

export default class MainLayout extends Component {

  constructor() {
    super();
    this.state = {
      fadeIn: false,
      pageIsTransitioning: true,
      cachedComponent: null
    };
  }

  onHeaderLoaded() {
    this.setState({
      fadeIn: true
    })
  }

  componentWillReceiveProps(next) {
    this.setState({
      pageIsTransitioning: false,
      cachedComponent: this.props.children
    });
    setTimeout((() => {
      this.setState({
        pageIsTransitioning: true,
        cachedComponent: null
      });
    }), 500);
  }

  onBodyClick() {
    this.refs.header.removeNotifications();
  }

  render() {
    return (
      <VelocityComponent animation={{ opacity: this.state.fadeIn ? 1 : 0 }} duration={400}>
        <div style={{opacity: 0}}>
          <Header ref="header" onLoad={this.onHeaderLoaded.bind(this)} />
          <VelocityComponent animation={{ opacity: this.state.pageIsTransitioning ? 1 : 0 }}>
            <div className="box row content">
              {this.state.cachedComponent || this.props.children}
            </div>
          </VelocityComponent>
          <Footer />
        </div>
      </VelocityComponent>
    )
  }
}
