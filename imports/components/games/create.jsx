import React, { Component } from "react";
import Modal from "react-modal";
import Dropzone from "react-dropzone";

import { Banners } from "/imports/api/event/banners.js";

import ImageForm from "/imports/components/public/img_form.jsx";

export default class CreateGameModal extends Component {

  componentWillMount() {
    this.setState({
      open: false
    })
  }

  toggleModal() {
    this.setState({
      open: !this.state.open
    })
  }

  submit(e){
    e.preventDefault();
    this.refs.image.value();
  }

  onImageUploaded(img) {
    Meteor.call("games.create", this.refs.name.value, img._id, (err) => {
      if(err){
        toastr.error(err.reason, "Error!")
      }
      else {
        toastr.success("Successfully sent game for review.", "Success!");
      }
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleModal.bind(this)}>Add a Game</button>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="div-pad">
            <div className="close" onClick={this.toggleModal.bind(this)}>&#10006;</div>
          </div>
          <div>
              <label>
                <h3>Game Name</h3>
              </label>
              <input type="text" ref="name" placeholder="Game Name" />
              <ImageForm ref="image" aspectRatio={16/9} collection={Images} callback={this.onImageUploaded.bind(this)} />
              <div>
                <button onClick={this.submit.bind(this)}>Submit</button>
              </div>
          </div>
        </Modal>
      </div>
    )
  }
}
