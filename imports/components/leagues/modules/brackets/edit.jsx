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
      <BracketForm ref="form" {...this.props.bracket} />
    )
  }
}
