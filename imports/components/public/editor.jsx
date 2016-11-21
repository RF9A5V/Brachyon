import React, { Component } from "react";
import ReactSummernote from "react-summernote";

import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

export default class Editor extends Component {
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
      <ReactSummernote value={this.props.value || ""} options={{
        height: 350,
        toolbar: tools,
        disableDragAndDrop: !this.props.useInsert
      }} onChange={this.props.onChange}/>
    )
  }
}
