import React, { Component } from "react";
import Modal from "react-modal";
import { Entity, EditorState, AtomicBlockUtils } from "draft-js";

export default class VideoEntity extends Component {

  onVidAdd() {
    var editor = this.props.editorRef.state.editorState;
    var entity = Entity.create("LINK", "MUTABLE", { iframe: this.refs.iframe.value, type: "VIDEO" });
    var state = AtomicBlockUtils.insertAtomicBlock(editor, entity, "text");
    this.props.editorRef.setState({
      isVidOpen: false,
      editorState: state
    })
  }

  render() {
    return (
      <Modal isOpen={true} onRequestClose={ () => { this.props.editorRef.setState({ isVidOpen: false }) } }>
        <div className="col">
          <div className="row center">
            <h3>Add Video</h3>
          </div>
          <h5>IFrame Embed</h5>
          <textarea ref="iframe"></textarea>
          <div className="row center">
            <button onClick={this.onVidAdd.bind(this)}>Add Video</button>
          </div>
        </div>
      </Modal>
    )
  }
}
