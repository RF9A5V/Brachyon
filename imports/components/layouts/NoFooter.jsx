import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";

import Header from '../public/header.jsx';

export default class NoFooterLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeIn: false
    }
  }

  componentWillUnmount() {
    this.setState({
      fadeIn: false
    })
  }

  componentDidMount() {
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

  render() {
    return (
      <div>
        <Header ref="header" onLoad={() => { this.setState({ fadeIn: true }) }} />
        <VelocityComponent animation={{opacity: this.state.fadeIn ? 1 : 0}} duration={400}>
          <div className="box">
            { this.props.children }
          </div>
        </VelocityComponent>
      </div>
    )
  }
}
