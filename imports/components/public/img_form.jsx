import React, { Component } from 'react';
import Cropper from 'react-cropper';

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ImageForm extends ResponsiveComponent {

  componentWillMount() {
    super.componentWillMount();
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

  getPreview() {
    return this.refs.cropper.getCroppedCanvas().toDataURL();
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

  value() {
    try {
      var boxData = this.dimensions();
    }
    catch(e) {
      return null;
    }
    const mimeType = this.state.file.type;
    const type = mimeType.slice(mimeType.indexOf("/") + 1);
    var content = {
      image: this.state.file,
      type,
      meta: boxData
    }
    this.setState({
      file: null,
      url: null
    })
    return content;
  }

  updateImage(e){
    e.preventDefault();
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    var type = file.type;
    reader.onload = () => {
      this.setState({
        url: reader.result,
        file,
        type
      })
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
      url: null,
      file: null
    })
  }

  getDataUrl() {
    if(this.refs.cropper) {
      return this.refs.cropper.getCroppedCanvas().toDataURL();
    }
    return null;
  }

  renderBase(opts) {
    var value = "";
    if(this.state.url){
      value = (
        <div className="row">
          <Cropper
            aspectRatio={this.props.aspectRatio || 1}
            src={this.state.url}
            style={{width: opts.width, height: opts.height}}
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
        <div className="row center x-center">
          { value }
        </div>
        <input type="file" ref="file" accept="image/*" style={{display: "none"}} onChange={this.updateImage.bind(this)} />
        <div className="row center" style={{marginTop: 20}}>
          {
            this.state.url || this.props.defaultImage ? (
              <button className={opts.buttonClass} onClick={() => { this.refs.file.click() }}>Change</button>
            ) : (
              <button className={opts.buttonClass} onClick={() => { this.refs.file.click() }}>{ this.props.buttonText || "Choose Image" }</button>
            )
          }
          {
            this.props.children
          }
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      buttonClass: "",
      width: 500,
      height: 300
    })
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      buttonClass: "large-button",
      width: 800,
      height: 500
    })
  }
}
