import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketsPanel extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col">
        <BracketForm {...this.props.attrs.brackets} onChange={(game, format) => {
          this.props.attrs.brackets.gameObj = game;
          this.props.attrs.brackets.format = format;
        }} />
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
