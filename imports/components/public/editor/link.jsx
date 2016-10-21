import React, { Component } from "react";
import Modal from "react-modal";
import { Entity, EditorState, AtomicBlockUtils } from "draft-js";

export default class LinkEntity extends Component {

  onAddLink() {
    var editor = this.props.editorRef.state.editorState;
    var entity = Entity.create("LINK", "MUTABLE", { href: this.refs.link.value, type: "LINK" });
    var state = AtomicBlockUtils.insertAtomicBlock(editor, entity, this.refs.text.value);
    this.props.editorRef.setState({
      isLinkOpen: false,
      editorState: state
    })
  }

  render() {
    return (
      <Modal isOpen={true} onRequestClose={() => { this.props.editorRef.setState({ isLinkOpen: false }) }}>
        <div className="col">
          <div className="row center">
            <h3>Add Link</h3>
          </div>
          <h5>Link Text</h5>
          <input type="text" ref="text" />
          <h5>Link Location</h5>
          <input type="text" ref="link" />
          <div className="row center">
            <button onClick={this.onAddLink.bind(this)}>Add Link</button>
          </div>
        </div>
      </Modal>
    )
  }
}
