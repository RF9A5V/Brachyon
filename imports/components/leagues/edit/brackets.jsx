import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

class BracketsPanel extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

class LeagueBracketForm extends Component {
  render() {
    return (
      <BracketForm {...this.props.bracket} game={this.props.game} />
    )
  }
}

export {
  BracketsPanel,
  LeagueBracketForm
}
