import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx"

export default class BracketEditAction extends Component {
  render() {
    return (
      <div>
        <BracketForm {...this.props.bracket} />
      </div>
    );
  }
}
