import React, { Component } from "react";
import { browserHistory } from "react-router";

import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class ShortLinkScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  componentDidMount() {
    Meteor.call("getLongUrl", this.props.params.id, (err, data) => {
      if(err) {
        toastr.error("Error grabbing short URL.");
      }
      this.setState({
        ready: true,
        url: err ? "/" : data
      })
    });
  }

  render() {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.ready} onReady={() => { browserHistory.push(this.state.url) }} />
      )
    }
    return null;
  }
}
