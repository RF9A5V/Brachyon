import React, { Component } from "react";
import Modal from "react-modal";
import { Entity, EditorState, AtomicBlockUtils } from "draft-js";

export default class ImgEntity extends Component {

  constructor(props) {
    super(props);
  }

  onImgAdd() {
    var editor = this.props.editorRef.state.editorState;
    var entity = Entity.create("LINK", "MUTABLE", { src: this.refs.src.value, type: "IMAGE" });
    var state = AtomicBlockUtils.insertAtomicBlock(editor, entity, "text");
    this.props.editorRef.setState({
      isImgOpen: false,
      editorState: state
    })
  }

  render() {
    var editor = this.props.editorRef;
    return (
      <Modal isOpen={true} onRequestClose={() => { editor.setState({ isImgOpen: false }) }}>
        <div className="col">
          <div className="row center">
            <h3>
              Add Image
            </h3>
          </div>
          <h5>
            Image Link
          </h5>
          <input type="text" ref="src" />
          <div className="row center">
            <button onClick={ this.onImgAdd.bind(this) }>
              Use Image
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}
