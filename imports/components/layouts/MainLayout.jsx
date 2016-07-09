import React, {Component} from 'react';
import Header from '../public/header.jsx';
import Footer from '../public/footer.jsx';

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="box row content">
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
