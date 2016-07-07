import React, { Component } from "react";
import Modal from "react-modal";
import Dropzone from "react-dropzone";

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
    var self = this;
    Meteor.call("games.create", self.refs.name.value, self.refs.image.value(), function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Submitted game for review.");
      }
      self.setState({open: false})
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
            <form onSubmit={this.submit.bind(this)} className="col">
              <label>
                <h3>Game Name</h3>
              </label>
              <input type="text" ref="name" placeholder="Game Name" />
              <ImageForm ref="image" aspectRatio={16/9} />
              <div>
                <input type="submit" value="Submit Game" />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}
