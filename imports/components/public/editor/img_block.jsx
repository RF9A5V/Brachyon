import React, { Component } from "react";

export default class ImageBlock extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    var { src } = this.props.blockProps;
    return (
      <img style={{width: "100%", height: "auto"}} src={src} />
    );
  }
}
