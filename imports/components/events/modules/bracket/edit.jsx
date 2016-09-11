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
    Meteor.call("events.brackets.edit", this.state.id, this.props.index, bracket.name, bracket.game, bracket.format, (err) => {
      if(err) {
        return toastr.error("Error in updating brackets!", "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated brackets!", "Success!");
      }
    })
  }

  onBracketDelete() {
    Meteor.call("events.brackets.delete", this.state.id, this.props.index, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully deleted bracket!");
      }
    })
  }

  render() {
    return (
      <div>
        <div className="row flex-pad x-center">
          <span>{ this.props.bracket.name }</span>
          <div>
            <button onClick={this.onBracketDelete.bind(this)} style={{marginRight: 10}}>Delete</button>
            <button onClick={this.onBracketSave.bind(this)}>Save</button>
          </div>
        </div>
        <BracketForm ref="form" {...(this.props.bracket || {})} />
      </div>
    )
  }
}