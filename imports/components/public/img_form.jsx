import React, { Component } from 'react';
import Cropper from 'react-cropper';

export default class ImageForm extends Component {

  componentWillMount(){
    this.setState({
      file: null
    })
  }

  onClick(e) {
    e.preventDefault();
    this.refs.file.click();
  }

  updateImage(e) {
    e.preventDefault();
    reader = new FileReader();
    type = e.target.files[0].type
    reader.onload = (function() {
      this.setState({
        file: reader.result,
        type: type
      })
    }).bind(this)
    reader.readAsDataURL(e.target.files[0]);
  }

  uploadImage(e) {
    e.preventDefault();
    var imageData = this.refs.cropper.getImageData();
    var widthRatio = imageData.naturalWidth / imageData.width;
    var heightRatio = imageData.naturalHeight / imageData.height;
    var boxData = this.refs.cropper.getCropBoxData();
    var widthOffset = (this.refs.cropper.getContainerData().width - this.refs.cropper.getCanvasData().width) / 2;
    var heightOffset = (this.refs.cropper.getContainerData().height - this.refs.cropper.getCanvasData().height) / 2;
    boxData.width *= widthRatio;
    boxData.height *= heightRatio;
    boxData.left = (boxData.left - widthOffset) * widthRatio;
    boxData.top = (boxData.top - heightOffset) * heightRatio;
    this.props.handler({ content: this.state.file, type: this.state.type, dimensions: boxData });
  }

  render() {
    if(!this.state.file){
      return (
        <div>
          <input type="file" ref="file" style={{display: 'none'}} onChange={this.updateImage.bind(this)} />
          <button onClick={this.onClick.bind(this)}>Update File</button>
        </div>
      )
    }
    else {
      return (
        <div className="col center x-center">
          <Cropper
          ref="cropper"
          src={this.state.file}
          style={{width: '85%', height: '30vh'}}
          zoomable={false}
          aspectRatio={this.props.aspectRatio || 1} />
          <button onClick={this.uploadImage.bind(this)}>Submit</button>
        </div>
      )
    }
  }
}
