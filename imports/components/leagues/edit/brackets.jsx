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
    var current = this.props.bracket;
    var log = this.props.changelog;
    if(log && log.league && log.league.brackets) {
      current = log.league.brackets;
    }
    return (
      <BracketForm {...current} game={this.props.game} onChange={(game, format) => {
        var log = this.props.changelog;
        if(!log.league) {
          log.league = {};
        }
        if(!log.league.brackets) {
          log.league.brackets = {};
        }
        log.league.brackets.format = format;
        log.league.game = game._id;
      }} />
    )
  }
}

export {
  BracketsPanel,
  LeagueBracketForm
}
