import React, { Component } from "react";
import ReactQuill from "react-quill";

import LocationSelect from "../create/location_select.jsx";
import DateInput from "../create/date_input.jsx";
import TimeInput from "../create/time_input.jsx";
import ImageForm from "../../public/img_form.jsx";

export default class DetailsPanel extends Component {

  values() {
    return {
      name: this.refs.name.value,
      description: this.refs.description.getEditor().getHTML(),
      location: this.refs.location.value(),
      datetime: this.refs.date.value() + "T" + this.refs.time.value(),
      banner: this.refs.image.value()
    }
  }

  formats() {
    return [
      { label:"Text", type:"group", items: [
    		{ type:"bold", label:"Bold" },
    		{ type:"italic", label:"Italic" },
    		{ type:"separator" },
    		{ type:"link", label:"Link" },
        { type:"separator" },
        { type:"bullet", label:"Bullet" },
    		{ type:"separator" },
    		{ type:"list", label:"List" },
        { type:"separator" },
        { type:"image", label:"Image" }
    	]},
    ];
  }

  onClick(e) {
    this.props.updateSuite(this.values());
  }

  render() {
    return (
      <div style={{position: "relative"}}>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="row">
          <div className="side-tab-panel col-1">
            <h3>Event Name:</h3>
            <input type="text" placeholder="Title" ref="name" ref="name" defaultValue={this.props.name} />
          </div>
          <div className="side-tab-panel col-1">
            <h3>Banner:</h3>
            <ImageForm ref="image" aspectRatio={16/9} id={this.props.banner} collection={Images} />
          </div>
        </div>
        <div className="side-tab-panel col-1">
          <h3>Description:</h3>
          <ReactQuill
            ref="description"
            value={this.props.description}
            theme="snow"
            toolbar={this.formats()}
          />
        </div>
        <div className="row">
          <div className="side-tab-panel col-1">
            <h3>Location:</h3>
            <LocationSelect ref="location" {...this.props.location} />
          </div>
          <div className="side-tab-panel col-1">
            <h3>Start Date:</h3>
            <div>
              <DateInput ref="date" init={this.props.datetime} />
            </div>
            <h3>Start Time:</h3>
            <TimeInput ref="time" init={this.props.datetime} />
          </div>
        </div>
      </div>
    )
  }
}
