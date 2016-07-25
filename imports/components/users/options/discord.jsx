import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import Cropper from "react-cropper";

export default class DiscordServerPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      linkOpen: false
    };
    this.modalStyle = {
      overlay: {
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 5
      },
      content: {
        position: "relative",
        backgroundColor: "#333",
        width: "30%",
        height: "75%",
        border: "none",
        top: 0,
        bottom: 0,
        borderRadius: 0,
        padding: 30
      }
    }
  }

  openServerLinkModal(e) {
    e.preventDefault();
    this.setState({
      linkOpen: true
    })
  }

  imgOrDefault() {
    if(this.state.file){
      return this.state.file;
    }
    else {
      return "/images/blank.gif";
    }
  }

  updateImage(e){
    e.preventDefault();
    var self = this;
    var reader = new FileReader();
    var type = e.target.files[0].type;
    reader.onload = function() {
      self.setState({
        file: reader.result,
        type
      })
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        {
          Object.keys(Meteor.user().profile.linkedServers || {}).map(function(key) {
            return (
              <div className="server-block">
                { key }
              </div>
            )
          })
        }
        <div className="server-block" onClick={this.openServerLinkModal.bind(this)}>
          <div className="server-icon">
            <FontAwesome name="plus" size="3x" />
          </div>
          <div className="server-name">
            <span>
              Add A Server
            </span>
          </div>
        </div>
        <Modal isOpen={this.state.linkOpen} style={this.modalStyle} onRequestClose={() => { this.setState({linkOpen: false}) }}>
          <div className="server-icon">
            <input type="file" style={{display: "none"}} ref="serverIcon" onChange={this.updateImage.bind(this)} />
            {
              (this.state.file) ? (
                <Cropper
                  aspectRatio={1}
                  src={this.state.file}
                  style={{width: 225, height: 225}}
                  ref="cropper"
                />
              ) : (
                <img src={this.imgOrDefault()} style={{ width: 225, height: 225, border: "dashed 3px white" }} onClick={() => { this.refs.serverIcon.click() }} />
              )
            }
          </div>
          <div className="server-name col">
            <label style={{marginBottom: 10}}>Server Name</label>
            <input type="text" ref="serverName" />
            <button style={{marginTop: 5}}>Link A Server</button>
          </div>
        </Modal>
      </div>
    )
  }
}
