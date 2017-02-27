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

  value() {
    return this.refs.img.value();
  }

  render() {
    var event = Events.findOne();
    var img = event.details.bannerUrl;
    return (
      <div>
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
          <ImageForm ref="img" aspectRatio={16/9} meta={{eventSlug: event.slug}} />
        </div>
      </div>
    )
  }
}
