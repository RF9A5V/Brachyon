import React, { Component } from "react";

export default class StreamPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0
    }
  }

  value() {
    if(this.refs.streamID.value == "") {
      toastr.error("Need input for stream.");
      throw new Error("StreamID can't be empty.");
    }
    return {
      streamName: this.refs.streamID.value
    };
  }

  render() {
    var tabs = ["Chat", "Video"];
    return (
      <div className="col panel">
        <h3>Add A Stream</h3>
        <input type="text" ref="streamID" />
        <a style={{fontSize: 12}} href="#">What do I put here?</a>
      </div>
    )
  }
}
