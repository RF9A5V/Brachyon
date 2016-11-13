import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer/footer.jsx';

require('velocity-animate');
import { VelocityComponent } from "velocity-react";
require('velocity-animate/velocity.ui');

export default class MainLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false
    };
  }

  onHeaderLoaded() {
    this.setState({
      fadeIn: true
    })
  }

  onBodyClick() {
    this.refs.header.removeNotifications();
  }

  render() {
    return (
      <VelocityComponent animation={{ opacity: this.state.fadeIn ? 1 : 0 }} duration={400}>
        <div style={{opacity: 0}}>
          <Header ref="header" onLoad={this.onHeaderLoaded.bind(this)} />
          <div className="box row content">
            { this.props.children }
          </div>

          <Footer />
        </div>
      </VelocityComponent>
    )
  }
}
