import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";

export default class LeagueDescription extends Component {

  value() {
    return this.state.content;
  }

  render() {
    var league = Leagues.findOne();
    return (
      <div>
        <h4>League Details</h4>
        <div className="submodule-bg">
          <Editor usePara={true} useInsert={true} useTable={true} value={league.details.description} onChange={(value) => {
            this.setState({ content: value })
          }} />
        </div>
      </div>
    )
  }
}
