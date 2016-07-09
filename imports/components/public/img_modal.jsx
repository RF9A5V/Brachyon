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
    this.props.handler(this.refs.image.value());
  }

  render() {
    return (
      <div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="div-pad">
            <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
          </div>
          <ImageForm ref="image" collection={ProfileImages} id={Meteor.user().profile.image}/>
          <button onClick={this.onClick.bind(this)}>Submit</button>
        </Modal>
      </div>
    );
  }
}
