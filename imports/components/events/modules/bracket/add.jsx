import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class AddBracket extends Component {

  constructor(props) {
    super();
    this.state = {
      id: Events.findOne()._id
    }
  }

  onBracketSave(){
    var bracket = this.refs.form.value();
    Meteor.call("events.brackets.add", this.state.id, bracket.name, bracket.game, bracket.format, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully added bracket!", "Success!");
      }
    })
  }

  render() {
    return (
      <div className="col">
        <div className="button-row">
          <button onClick={() => { this.onBracketSave() }}>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center">
            <h3>Add Bracket</h3>
          </div>
          <BracketForm ref="form" />
        </div>
      </div>
    )
  }
}
