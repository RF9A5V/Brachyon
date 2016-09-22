import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { Images } from "/imports/api/event/images.js";

export default class ImagePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onImageSave() {
    var bannerId = this.refs.img.value();

  }

  onUploadComplete(data) {
    Meteor.call("events.details.imageSave", this.state.id, data._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated event banner.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    var img = Images.findOne(event.details.banner);
    return (
      <div>
        <div className="row flex-pad x-center">
          <span>Image</span>
          <button onClick={this.onImageSave.bind(this)}>Save</button>
        </div>
        <img src={img ? img.link() : ""} />
        <ImageForm ref="img" id={ event.details.image } aspectRatio={16/9} collection={Images} callback={ this.onUploadComplete.bind(this) } />
      </div>
    )
  }
}
