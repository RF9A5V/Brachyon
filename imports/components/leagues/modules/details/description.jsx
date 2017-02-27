import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";

export default class LeagueDescription extends Component {

  value() {
    return this.refs.description.value();
  }

  render() {
    var league = Leagues.findOne();
    return (
      <Editor ref="description" usePara={true} useInsert={true} useTable={true} value={league.details.description} />
    )
  }
}
