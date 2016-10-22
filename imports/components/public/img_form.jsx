import React, { Component } from 'react';
import Cropper from 'react-cropper';

export default class ImageForm extends Component {

  componentWillMount() {
    this.setState({
      id: this.props.id,
      uploader: null
    });
  }

  value(getBase64) {
    if(!this.state.url){
      if(this.props.callback){
        this.props.callback({_id: this.props.id});
      }
      return this.props.id;
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

    if(getBase64){
      return {
        boxData,
        base64: this.state.url
      }
    }
    var type = "";
    if(this.state.type == "image/jpeg" || this.state.type == "image/jpg") {
      type = ".jpg";
    }
    else if(this.state.type == "image/png") {
      type = ".png";
    }
    this.props.collection.insert({
      file: this.state.url,
      isBase64: true,
      fileName: Meteor.userId() + type, // Weird shit until I figure out if we want to save the initial file name
      meta: boxData,
      onStart: () => {
        toastr.warning("Now uploading image.", "Warning")
      },
      onUploaded: (err, data) => {
        if(this.props.callback){
          this.props.callback(data);
        }
      },
      onError: (err) => {
        toastr.error("Well that was expected.", "GG");
        console.log(err);
      }
    });
  }

  updateImage(e){
    e.preventDefault();
    var self = this;
    var reader = new FileReader();
    var type = e.target.files[0].type;
    console.log(e.target.files[0]);
    if(this.props.onSelect){
      this.props.onSelect();
    }
    reader.onload = function() {
      self.setState({
        url: reader.result,
        type
      });
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  componentWillReceiveProps(next) {
    this.setState({
      url: null
    })
  }

  image() {
    return this.props.collection.findOne(this.props.id);
  }

  render() {
    var value = "";
    if(this.state.url){
      value = (<Cropper
        aspectRatio={this.props.aspectRatio || 1}
        src={this.state.url}
        style={{width: "100%", maxWidth: 500, height: 300}}
        ref="cropper"
        zoomable={false}
        zoomOnWheel={false}
      />);
    }
    else if(this.props.id != null){
      value = (<img src={this.image().link()} style={{width: "100%", height: "auto"}} />);
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
        { value }
        <input type="file" ref="file" accept="image/*" style={{display: "none"}} onChange={this.updateImage.bind(this)} />
        <div style={{marginTop: 20}}>
          <button onClick={() => { this.refs.file.click() }}>Choose Image</button>
        </div>
      </div>
    )
  }
}
