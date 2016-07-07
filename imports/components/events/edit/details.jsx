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

  testClientSide(e) {
    var info = this.refs.image.value()
    if(!info){
      return;
    }
    var file = new FS.File(info);
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
      <div className="col" style={{position: "relative"}}>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="row" style={{alignItems: "flex-start"}}>
          <div className="side-tab-panel">
            <label>Event Name</label>
            <input type="text" ref="name" ref="name" defaultValue={this.props.name} />
          </div>
          <div className="side-tab-panel">
            <label>Banner</label>
            <ImageForm ref="image" aspectRatio={16/9} url={this.props.banner} />
            <button onClick={this.testClientSide.bind(this)}>Test</button>
          </div>
          <div className="side-tab-panel">
            <label style={{marginBottom: 10}}>Description</label>
            <ReactQuill
              ref="description"
              value={this.props.description}
              theme="snow"
              toolbar={this.formats()}
            />
          </div>
          <div className="side-tab-panel">
            <label style={{marginTop: 10, marginBottom: 10}}>Location</label>
            <LocationSelect ref="location" {...this.props.location} />
          </div>
          <div className="side-tab-panel">
            <label>Start Date</label>
            <div>
              <DateInput ref="date" init={this.props.datetime} />
            </div>
            <label style={{marginBottom: 10}}>Start Time</label>
            <TimeInput ref="time" init={this.props.datetime} />
          </div>
          <div style={{minWidth: "calc(85vw - 480px)", height: 1}}>
          </div>
        </div>
      </div>
    )
  }
}
