import React, { Component } from "react";
import ReactSummernote from "react-summernote";

import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/tooltip';

export default class Editor extends Component {
  render() {
    return (
      <ReactSummernote value={this.props.value || ""} options={{
        height: 350,
        toolbar: [
          ['style', ['bold', 'italic', 'underline']],
          ['insert', ['link', 'picture', 'video']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']]
        ]
      }} onChange={this.props.onChange}/>
    )
  }
}
