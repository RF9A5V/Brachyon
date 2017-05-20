import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bracket: props.bracket || {}
    }
  }

  value() {
    const obj = this.refs.bracket.value()
    if(!obj.gameName && !obj.game){
      toastr.error("Bracket requires a game!");
      throw new Error("Bracket game must be defined.");
    }
    return obj;
  }

  render() {
    return (
      <div className="col">
        <BracketForm {...this.state.bracket} ref="bracket" />
        {/* <h5 style={{margin: "20px 0"}}>Scoring System</h5>
        <select defaultValue={this.props.attrs.brackets.scoring} onChange={(e) => { this.props.attrs.brackets.scoring = e.target.value }}>
          <option value={"linear"}>
            Linear
          </option>
          {
            // <option value={"exp"}>
            //   Exponential
            // </option>
          }
        </select> */}
      </div>
    )
  }
}
