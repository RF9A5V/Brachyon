import React, { Component } from "react";
import { Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw, Modifier, Entity } from 'draft-js';
import Immutable from "immutable";
import FontAwesome from "react-fontawesome";

import LinkEntity from "./editor/link.jsx";
import LinkBlock from "./editor/link_block.jsx";

import ImageEntity from "./editor/img.jsx";
import ImageBlock from "./editor/img_block.jsx";

import VideoEntity from "./editor/video.jsx";
import VideoBlock from "./editor/video_block.jsx";

export default class BrachyonEditor extends Component {
  constructor(props) {
    super(props);
    var state;
    if(props.value) {
      if(typeof(props.value) == "object") {
        state = EditorState.createWithContent(convertFromRaw(props.value));
      }
      else {
        state = EditorState.createWithContent(ContentState.createFromText(props.value));
      }
    }
    else {
      state = EditorState.createEmpty()
    }
    this.state = {
      editorState: state,
      isBold: false,
      isItalic: false,
      isStrike: false,
      isLinkOpen: false,
      isImgOpen: false,
      isVidOpen: false
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
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
    this.setState({
      isBold: !this.state.isBold
    })
  }

  toggleItalic() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"));
    this.setState({
      isItalic: !this.state.isItalic
    })
  }

  toggleStrike() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH"));
    this.setState({
      isStrike: !this.state.isStrike
    })
  }

  editorButtons() {
    return (
      <div className="row x-center">
        <div className={`editor-button ${this.state.isBold ? "active" : ""}`} style={{fontWeight: "bold"}} onClick={this.toggleBold.bind(this)}>
          <FontAwesome name="bold" />
        </div>
        <div className={`editor-button ${this.state.isItalic ? "active" : ""}`} style={{fontStyle: "italic"}} onClick={this.toggleItalic.bind(this)}>
          <FontAwesome name="italic" />
        </div>
        <div className={`editor-button ${this.state.isStrike ? "active" : ""}`} style={{textDecoration: "line-through"}} onClick={this.toggleStrike.bind(this)}>
          <FontAwesome name="strikethrough" />
        </div>
        <div style={{width: 2.5, height: 45, backgroundColor: "white", marginRight: 10}}>
        </div>
        <div className="editor-button" onClick={() => { this.setState({isLinkOpen: true}) }}>
          <FontAwesome name="link" />
        </div>
        <div className="editor-button" onClick={() => { this.setState({ isImgOpen: true }) }}>
          <FontAwesome name="picture-o" />
        </div>
        <div className="editor-button" onClick={() => { this.setState({ isVidOpen: true }) }}>
          <FontAwesome name="video-camera" />
        </div>
      </div>
    )
  }

  blockRenderer(contentBlock) {
    const type = contentBlock.getType();
    if(type == "atomic") {
      console.log(contentBlock.getEntityAt(0));
      var entityKey = contentBlock.getEntityAt(0);
      if(entityKey == null) {
        return null;
      }
      var entity = Entity.get(contentBlock.getEntityAt(0)).getData();
      if(entity.type == "LINK") {
        return {
          component: LinkBlock,
          editable: !this.props.isEditable === false,
          props: {
            text: contentBlock.getText(),
            href: entity.href
          }
        }
      }
      if(entity.type == "IMAGE") {
        return {
          component: ImageBlock,
          editable: !this.props.isEditable === false,
          props: {
            src: entity.src
          }
        }
      }
      if(entity.type == "VIDEO") {
        return {
          component: VideoBlock,
          editable: !this.props.isEditable === false,
          props: {
            iframe: entity.iframe
          }
        }
      }

    }
    return null;
  }

  focus() {
    this.refs.editor.focus();
  }

  render() {
    if(this.props.isEditable === false) {
      return (
        <div>
          <Editor editorState={this.state.editorState} blockRendererFn={this.blockRenderer.bind(this)} readOnly={true} ref="editor" />
        </div>
      )
    }
    return (
      <div onClick={this.focus.bind(this)}>
        {
          this.editorButtons()
        }
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          blockRendererFn={this.blockRenderer.bind(this)}
          ref="editor"
        />
        {
          this.state.isLinkOpen ? (
            <LinkEntity editorRef={this} />
          ) : (
            ""
          )
        }
        {
          this.state.isImgOpen ? (
            <ImageEntity editorRef={this} />
          ) : (
            ""
          )
        }
        {
          this.state.isVidOpen ? (
            <VideoEntity editorRef={this} />
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
