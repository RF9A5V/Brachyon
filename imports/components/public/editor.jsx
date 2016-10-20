import React, { Component } from "react";
import { Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

export default class BrachyonEditor extends Component {
  constructor(props) {
    super(props);
    var state;
    if(props.value) {
      state = EditorState.createWithContent(convertFromRaw(props.value));
    }
    else {
      state = EditorState.createEmpty()
    }
    this.state = {
      editorState: state,
      isBold: false
    };
  }

  value() {
    var content = this.state.editorState.getCurrentContent();
    return convertToRaw(content);
  }

  onChange(editorState) {
    this.setState({
      editorState
    });
  }

  toggleBold() {
    this.state.isBold = !this.state.isBold;
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  setBlockClasses(content) {
    const type = content.getType();
    if(type == "div") {
      return "edit-line"
    }
  }

  render() {
    return (
      <div>
        <div className="row x-center">
          <div className={`editor-button ${this.state.isBold ? "active" : ""}`} onClick={this.toggleBold.bind(this)}>
            B
          </div>
        </div>
        <Editor editorState={this.state.editorState} onChange={this.onChange.bind(this)} blockStyleFn={this.setBlockClasses.bind(this)}/>
      </div>
    );
  }
}
