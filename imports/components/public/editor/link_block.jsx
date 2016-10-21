import React, { Component } from "react";
import { Entity } from "draft-js";

export default class LinkBlock extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var { text, href } = this.props.blockProps;
    return (
      <a href={href}>{ text }</a>
    )
  }
}
