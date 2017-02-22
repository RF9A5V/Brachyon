import React, { Component } from "react";

import BracketForm from "./form.jsx";

export default class EditBracket extends Component {

  constructor(props){
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  value() {
    return this.refs.form.value();
  }

  onRemove() {
    Meteor.call("events.brackets.remove", Events.findOne()._id, this.props.index, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      if(this.props.update) {
        this.props.update();
      }
      return toastr.success("Successfully removed bracket!");
    });
  }

  render() {
    return (
      <div>
        <h4>Bracket Edit</h4>
        <div className="submodule-bg submodule-overflow">
          <BracketForm ref="form" {...(this.props.bracket || {})} />
        </div>
        <div className="row" style={{justifyContent: "flex-end", marginTop: 10}}>
          <button style={{marginRight: 10}}>Save Bracket</button>
          <button onClick={this.onRemove.bind(this)}>Delete Bracket</button>
        </div>
      </div>
    )
  }
}
