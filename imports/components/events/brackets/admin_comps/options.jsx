import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketOptions extends Component {

  onBracketSave() {
    const value = this.refs.form.value();
    Meteor.call("events.brackets.edit", Instances.findOne()._id, this.props.index, value.name, value.game, value.format, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        if(this.props.bracket.id) {
          Meteor.call("events.start_event", Instances.findOne()._id, this.props.index, () => {
            toastr.success("Successfully updated bracket details!");
            this.props.onStart();
          });
        }
        else {
          toastr.success("Successfully updated bracket details!");
        }
      }
    })
  }

  render() {
    return (
      <div>
        <BracketForm {...this.props.bracket} ref="form" />
        <div className="row center" style={{marginTop: 20}}>
          <button onClick={this.onBracketSave.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
