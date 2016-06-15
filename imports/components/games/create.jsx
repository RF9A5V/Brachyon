import React, { Component } from 'react';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone';

export default class CreateGameModal extends Component {

  componentWillMount() {
    this.setState({
      open: false
    })
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
      file: null
    })
  }

  onDrop(files){
    this.setState({
      file: files[0]
    })
  }

  submit(e){
    e.preventDefault();
    self = this;

    if(this.state.file == null) {
      return toastr.error("You have to specify a banner.");
    }

    reader = new FileReader();
    reader.onload = function() {
      data = this.result;
      len = data.length;
      arr = new Uint8Array(len);
      for(var i = 0; i < len; i ++){
        arr[i] = data.charCodeAt(i);
      }
      Meteor.call('games.create', {
        name: self.refs.name.value,
        file: {
          type: self.state.file.type,
          content: arr
        }
      }, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Sent game for review.")
        }
        self.toggleModal();
      })
    }
    reader.readAsBinaryString(self.state.file);
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
            <form onSubmit={this.submit.bind(this)}>
              <label>
                <h3>Game Name</h3>
                <input type="text" ref="name" placeholder="Game Name" />
              </label>
              {
                this.state.file == null ? (
                  <Dropzone accept="image/*" multiple={false} onDrop={this.onDrop.bind(this)}>
                    <div className="row x-center center">
                      Drag And Drop
                    </div>
                  </Dropzone>
                ) : (
                  <img src={this.state.file.preview} style={{ width: '70%', height: 'auto' }} />
                )
              }
              <input type="submit" />
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}
