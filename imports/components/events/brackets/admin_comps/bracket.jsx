import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx"

export default class BracketEditAction extends Component {

  saveBracket() {
    const { name, game, format, options } = this.refs.form.value();
    Meteor.call("events.brackets.edit", Instances.findOne()._id, this.props.index, name, game, format, options, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated options.");
      }
    })
  }

  render() {
    return (
      <div>
        <BracketForm {...this.props.bracket} ref="form" />
        <div className="row center" style={{marginTop: 10}}>
          <button onClick={this.saveBracket.bind(this)}>Save</button>
        </div>
      </div>
    );
  }
}
