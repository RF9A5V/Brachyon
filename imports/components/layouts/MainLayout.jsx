import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer/footer.jsx';
import { Session } from 'meteor/session';

import moment from 'moment';

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
      <div>
        <Header ref="header" onLoad={this.onHeaderLoaded.bind(this)} />
        <div className="box row content">
          { this.props.children }
        </div>

        <Footer />
      </div>
    )
  }
}
