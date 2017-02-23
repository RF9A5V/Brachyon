import React, { Component } from "react";
import deepEqual from "deep-equal";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";

export default class BracketEdit extends Component {

  value() {
    var currentObj = {};
    var val = this.refs.form.value();
    Object.keys(val).forEach(k => {
      currentObj[k] = this.props.bracket[k];
    })
    if(deepEqual(currentObj, val)) {
      return null;
    }
    return this.refs.form.value()
  }

  render() {
    return (
      <div>
        <h4>Edit Bracket For { Events.findOne(this.props.eventId).details.name }</h4>
        <div className="submodule-bg">
          <BracketForm ref="form" {...this.props.bracket} />
        </div>
      </div>
    )
  }
}
