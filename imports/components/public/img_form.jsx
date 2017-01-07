import React, { Component } from 'react';
import Cropper from 'react-cropper';

export default class ImageForm extends Component {

  componentWillMount() {
    this.setState({
      id: this.props.id,
      uploader: null,
      file: null,
      url: null,
      meta: {}
    });
  }

  shouldComponentUpdate() {
    if(this.refs.cropper) {
      return false;
    }
    return true;
  }

  setMeta(key, value) {
    this.state.meta[key] = value;
  }

  hasValue() {
    if(this.state.url || this.props.defaultImage) {
      return true;
    }
    return false;
  }

  dimensions() {
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
    return boxData;
  }

  value(cb) {

    var boxData = this.dimensions();

    if(this.props.meta) {
      Object.keys(this.props.meta).forEach(key => {
        boxData[key] = this.props.meta[key];
      })
    }
    Object.keys(this.state.meta).forEach(key => {
      boxData[key] = this.state.meta[key];
    })
    var type = "";
    if(this.state.type == "image/jpeg" || this.state.type == "image/jpg") {
      type = ".jpg";
    }
    else if(this.state.type == "image/png") {
      type = ".png";
    }

    this.props.collection.insert({
      file: (this.state.url || this.props.defaultImage),
      isBase64: true,
      fileName: Meteor.userId() + type, // Weird shit until I figure out if we want to save the initial file name
      meta: boxData,
      onStart: () => {
        toastr.warning("Now uploading image.", "Warning")
      },
      onUploaded: (err, data) => {
        if(err){
          toastr.error(err.reason);
          cb(err, data);
        }
        if(cb) {
          cb(null, data);
        }
      }
    });
  }

  updateImage(e){
    e.preventDefault();
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    var type = file.type;
    if(this.props.onSelect){
      this.props.onSelect();
    }
    reader.onload = function() {
      if(self.props.onImgSelected) {
        self.props.onImgSelected(reader.result);
      }
      self.setState({
        url: reader.result,
        file,
        type
      });
    }
    reader.readAsDataURL(file);
  }

  componentWillReceiveProps(next) {
    this.setState({
      url: null
    })
  }

  reset() {
    this.setState({
      url: null
    })
  }

  getDataUrl() {
    if(this.refs.cropper) {
      return this.refs.cropper.getCroppedCanvas().toDataURL();
    }
    return null;
  }

  render() {
    var value = "";
    if(this.state.url || this.props.defaultImage){
      value = (
        <div className="row">
          <Cropper
            aspectRatio={this.props.aspectRatio || 1}
            src={this.state.url || this.props.defaultImage}
            style={{width: "100%", maxWidth: 500, height: 300}}
            ref="cropper"
            zoomable={false}
            zoomOnWheel={false}
          />
        </div>
      );
    }
    else if(this.props.url != null) {
      value = (<img src={this.props.url}  style={{width: "100%", height: "auto"}}/>);
    }
    else {
      value = (
        <div></div>
      );
    }
    return (
      <div className="col">
        <div className="row">
          { value }
        </div>
        <input type="file" ref="file" accept="image/*" style={{display: "none"}} onChange={this.updateImage.bind(this)} />
        <div className="row center" style={{marginTop: 20}}>
          {
            this.state.url || this.props.defaultImage ? (
              <button onClick={() => { this.refs.file.click() }}>Change</button>
            ) : (
              <button onClick={() => { this.refs.file.click() }}>Choose Image</button>
            )
          }
        </div>
      </div>
    )
  }
}
