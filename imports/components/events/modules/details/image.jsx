import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { Images } from "/imports/api/event/images.js";

export default class ImagePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      imgSelected: false
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
        <div className="button-row">
          <button onClick={this.onImageSave.bind(this)}>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center">
            <h3 style={{marginBottom: 20}}>Event Image</h3>
          </div>
          {
            this.state.imgSelected ? (
              ""
            ) : (
              <div style={{textAlign: "center"}}>
                <img src={img ? img.link() : ""} style={{width: "50%", margin: "20px 0", height: "auto"}} />
              </div>
            )
          }
          <div className="row center">
            <ImageForm ref="img" id={ event.details.image } aspectRatio={16/9} collection={Images} callback={ this.onUploadComplete.bind(this) } onSelect={() => { this.setState({imgSelected: true}) }} />
          </div>
        </div>
      </div>
    )
  }
}
