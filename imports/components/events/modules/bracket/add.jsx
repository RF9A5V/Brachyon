import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class AddBracket extends Component {

  onAdd() {
    var val = this.refs.form.value();
    Meteor.call("events.brackets.add", Events.findOne()._id, val.game, val.format, val.name || "", (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      toastr.success("Added bracket!");
      if(this.props.update){
        this.props.update();
      }
    })
  }

  value() {
    return null;
  }

  render() {
    return (
      <div className="col">
        <BracketForm ref="form" />
        <div className="row" style={{justifyContent: "flex-end", marginTop: 10}}>
          <button onClick={this.onAdd.bind(this)}>Add Bracket</button>
        </div>
      </div>
    )
  }
}
