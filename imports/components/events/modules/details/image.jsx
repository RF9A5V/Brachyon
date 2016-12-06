import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";
import { Banners } from "/imports/api/event/banners.js";

export default class ImagePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      imgSelected: false
    }
  }

  onImageSave() {
    this.refs.img.value(() => {
      toastr.success("Successfully updated event banner.", "Success!");
      this.props.onItemSelect(this.props.activeItem, 0);
    });
  }

  render() {
    var event = Events.findOne();
    var img = event.details.bannerUrl;
    return (
      <div>
        <div className="button-row">
          <button onClick={this.onImageSave.bind(this)}>Save</button>
        </div>
        <h4>Event Image</h4>
        <div className="submodule-bg">
          {
            img ? (
              <div style={{textAlign: "center"}}>
                <img src={img} style={{width: "50%", margin: "20px 0", height: "auto"}} />
              </div>
            ) : (
              ""
            )
          }
          <div className="row center">
            <ImageForm ref="img" id={ event.details.image } aspectRatio={16/9} collection={Banners} onSelect={() => { this.setState({imgSelected: true}) }} meta={{eventSlug: event.slug}} />
          </div>
        </div>
      </div>
    )
  }
}
