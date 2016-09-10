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
    Meteor.call("events.brackets.add", this.state.id, bracket.name, bracket.game, (err) => {
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
        <div className="row flex-pad">
          <span>Add Bracket</span>
          <button onClick={() => { this.onBracketSave() }}>Save</button>
        </div>
        <BracketForm ref="form" />
      </div>
    )
  }
}
