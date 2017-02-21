import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class AddBracket extends Component {

  constructor(props) {
    super();
    this.state = {
      id: Events.findOne()._id
    }
  }

  render() {
    return (
      <div className="col">
        <h4>Add Bracket</h4>
        <div className="submodule-bg submodule-overflow">
          <BracketForm ref="form" />
        </div>
        <div className="row" style={{justifyContent: "flex-end", marginTop: 10}}>
          <button>Add Bracket</button>
        </div>
      </div>
    )
  }
}
