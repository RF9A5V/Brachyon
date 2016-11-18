import React, { Component } from "react";

import ParticipantAddField from "./participant_add_field.jsx";

export default class BracketOptionsPanel extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <ParticipantAddField bracketIndex={this.props.bracketIndex} onComplete={this.props.onComplete} />
    );
  }
}
