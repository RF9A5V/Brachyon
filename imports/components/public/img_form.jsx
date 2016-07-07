import React, { Component } from 'react';
import Cropper from 'react-cropper';

export default class ImageForm extends Component {

  componentWillMount(){
    this.setState({
      file: this.props.url,
      crop: false
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
        type: type,
        crop: true
      })
    }).bind(this)
    reader.readAsDataURL(e.target.files[0]);
  }

  componentWillReceiveProps(next) {
    console.log(next);
    this.setState({
      file: next.url,
      crop: false
    })
  }

  value() {
    if(!this.state.crop){
      return this.state.file;
    }
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
    return { content: this.state.file, type: this.state.type, dimensions: boxData };
  }

  render() {
    if(!this.state.file){
      return (
        <div className="col">
          <input type="file" ref="file" accept="image/*" style={{display: 'none'}} onChange={this.updateImage.bind(this)} />
          <div>
            <button onClick={this.onClick.bind(this)}>Update File</button>
          </div>
        </div>
      )
    }
    else {
      if(!this.state.crop){
        return (
          <div className="col">
            <img style={{width: "100%", height: "auto"}} src={this.state.file} />
            <input type="file" ref="file" accept="image/*" style={{display: 'none'}} onChange={this.updateImage.bind(this)} />
            <div>
              <button onClick={this.onClick.bind(this)}>Update File</button>
            </div>
          </div>
        )
      }
      return (
        <div className="col">
          <input type="file" ref="file" accept="image/*" style={{display: 'none'}} onChange={this.updateImage.bind(this)} />
          <Cropper
          ref="cropper"
          src={this.state.file}
          style={{width: '100%', height: '30vh'}}
          zoomable={false}
          aspectRatio={this.props.aspectRatio || 1} />
          <div>
            <button onClick={this.onClick.bind(this)}>Update File</button>
          </div>
        </div>
      )
    }
  }
}
