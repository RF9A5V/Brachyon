import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class EditBracket extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onBracketSave() {
    var bracket = this.refs.form.value();
    Meteor.call("events.brackets.edit", this.state.id, this.props.index, bracket.name, bracket.game, (err) => {
      if(err) {
        return toastr.err("Error in updating brackets!", "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated brackets!", "Success!");
      }
    })
  }

  render() {
    return (
      <div>
        <div className="row flex-pad x-center">
          <span>{ this.props.bracket.name }</span>
          <button onClick={this.onBracketSave.bind(this)}>Save</button>
        </div>
        <BracketForm ref="form" {...(this.props.bracket || {})} />
      </div>
    )
  }
}
