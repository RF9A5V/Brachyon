import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class EditBracket extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  render() {
    return (
      <div>
        <h4>Bracket Edit</h4>
        <div className="submodule-bg submodule-overflow">
          <BracketForm ref="form" {...(this.props.bracket || {})} />
        </div>
        <div className="row" style={{justifyContent: "flex-end", marginTop: 10}}>
          <button>Delete Bracket</button>
        </div>
      </div>
    )
  }
}
