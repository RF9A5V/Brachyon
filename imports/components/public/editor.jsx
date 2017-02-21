import React, { Component } from "react";
import ReactSummernote from "react-summernote";

import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

export default class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ""
    }
  }

  value() {
    if(this.state.value.length == 0) {
      toastr.error("Description must be given!");
      throw new Error("Description for item cannot be zero-length. Please provide a brief description.");
    }
    return this.state.value;
  }

  reset() {
    ReactSummernote.reset();
  }

  componentWillReceiveProps() {
    this.forceUpdate();
  }

  render() {
    var tools = [['style', ['bold', 'italic', 'underline']]];
    if(this.props.useInsert) {
      tools.push(['insert', ['link', 'picture', 'video']]);
    }
    if(this.props.usePara) {
      tools.push(['para', ['ul', 'ol', 'paragraph']]);
    }
    if(this.props.useTable) {
      tools.push(['table', ['table']]);
    }
    return (
      <ReactSummernote value={this.state.value} options={{
        height: 350,
        toolbar: tools,
        disableDragAndDrop: !this.props.useInsert
      }} onChange={(value) => { this.setState({ value }) }}/>
    )
  }
}
