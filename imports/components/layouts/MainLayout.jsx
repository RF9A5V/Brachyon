import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer.jsx';

export default class MainLayout extends Component {
  render() {
    return (
      <div className="box" id="box">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
