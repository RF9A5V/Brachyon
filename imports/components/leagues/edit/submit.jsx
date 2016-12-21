import React, { Component } from "react";

export default class SubmitPanel extends Component {

  constructor(props) {
    super(props);
    console.log(props.changelog);
  }

  render() {
    return (
      <div>
        Submit this shiz
      </div>
    )
  }
}
