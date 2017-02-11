import React, { Component } from 'react';
import Modal from 'react-modal';

import ImageForm from '/imports/components/public/img_form.jsx';

import ProfileImages from "/imports/api/users/profile_images.js";

export default class ImageModal extends Component {

  componentWillMount(){
    this.setState({
      open: this.props.open
    })
  }

  componentWillReceiveProps(next){
    this.setState({
      open: next.open
    })
  }

  closeModal() {
    this.setState({
      open: false
    })
  }

  onClick() {
    var { image, meta, type } = this.refs.image.value();
    meta.userId = Meteor.userId();
    ProfileImages.insert({
      file: image,
      meta,
      fileName: Meteor.userId() + "." + type,
      onUploaded: (err) => {
        if(err) {
          toastr.error(err.reason);
          throw new Error(err.reason);
        }
        toastr.success("Updated profile image!");
      }
    })
  }

  render() {
    return (
      <div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="div-pad">
            <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
          </div>
          <ImageForm ref="image" />
          <button onClick={this.onClick.bind(this)}>Submit</button>
        </Modal>
      </div>
    );
  }
}
