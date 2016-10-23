import React, { Component } from "react";

export default class VideoBlock extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var { iframe } = this.props.blockProps;
    return (
      <div dangerouslySetInnerHTML={{ __html: iframe }}>
      </div>
    )
  }
}
