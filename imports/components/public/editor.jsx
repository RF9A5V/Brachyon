import React, { Component } from "react";
import { Editor, EditorState, RichUtils } from 'draft-js';

export default class BrachyonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      isBold: false
    };
  }

  onChange(editorState) {
    this.setState({
      editorState
    });
  }

  setBold() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  setBlockClasses(content) {
    const type = content.getType();
    console.log(type);
    if(type == "div") {
      return "edit-line"
    }
  }

  render() {
    return (
      <div>
        <div className="row x-center">
          <div className="editor-button" onClick={this.setBold.bind(this)}>
            B
          </div>
        </div>
        <Editor editorState={this.state.editorState} onChange={this.onChange.bind(this)} blockStyleFn={this.setBlockClasses.bind(this)}/>
      </div>
    );
  }
}
