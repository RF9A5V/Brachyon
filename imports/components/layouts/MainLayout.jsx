import React, {Component} from 'react';
import Header from '../public/header.jsx';

export default class MainLayout extends Component {
  render() {
    return (
      <div className="main-layout" id="main-layout">
        <Header />
        {this.props.children}
      </div>
    )
  }
}
