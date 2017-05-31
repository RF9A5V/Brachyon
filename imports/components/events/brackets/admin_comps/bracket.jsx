import React, { Component } from "react";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx"

export default class BracketEditAction extends Component {

  saveBracket() {
    const obj = this.refs.form.value();
    Meteor.call("events.brackets.edit", Instances.findOne()._id, this.props.index, obj, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated options.");
        if(this.props.bracket.slug != obj.slug) {
          window.location = `/bracket/${obj.slug}/admin`;
        }
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
