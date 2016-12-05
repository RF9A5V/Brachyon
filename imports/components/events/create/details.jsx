import React, { Component } from 'react';
import moment from "moment";

import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';
import ImageForm from "../../public/img_form.jsx";
import Editor from "../../public/editor.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charCount: 0,
      option: "Title",
      content: ""
    }
  }

  value() {
    if(this.refs.name.value == "") {
      toastr.error("Details name needs definition.");
      throw new Error("Details name needs definition.");
    }
    else if(this.refs.location.value() == null) {
      toastr.error("Details location needs definition.");
      throw new Error("Details location needs definition.");
    }
    else if(this.refs.date.value() == null || this.refs.time.value() == null) {
      toastr.error("Details datetime needs definition.");
      throw new Error("Details datetime needs definition.");
    }
    else {
      return {
        name: this.refs.name.value,
        location: this.refs.location.value(),
        description: this.state.content,
        datetime: moment(this.refs.date.value() + "T" + this.refs.time.value()).toDate(),
        image: this.refs.image
      }
    }
  }

  onChange(e) {
    var loc = this.refs.location.value();
    var locationValid = loc.online || Object.keys(loc).length >= 0;
    // this.props.onChange(
    //   this.refs.name.value != "" && this.refs.description.value != "" && locationValid
    // );
  }

  onTitleChange() {
    var text = this.refs.name.value;
    if(text.length > 50) {
      this.refs.name.value = text.substring(0, 50);
    }
    this.setState({
      charCount: this.refs.name.value.length
    })
  }

  setImage(base64) {
    this.setState({
      image: base64
    })
  }

  blockStyle(keyword) {
    if(this.state.option == keyword) {
      return {
        opacity: 1
      }
    }
    return {
      opacity: 0,
      height: 0,
      overflowY: "hidden"
    }
  }

  setDescriptionState(content) {
    this.setState({
      content
    })
  }

  render() {

    var options = ["Title", "Location", "Description", "Time", "Banner"]

    return (
      <div style={this.props.style}>
        <div className="row" style={{marginBottom: 20}}>
          {
            options.map(op => {
              var optionStyle = {
                padding: 10,
                marginRight: 10,
                width: 100,
                color: this.state.option == op ? "#0BDDFF" : "white",
                backgroundColor: "#111",
                cursor: "pointer"
              }
              return (
                <div className="row x-center center" style={optionStyle} onClick={() => { this.setState({ option: op }) }}>{op}</div>
              )
            })
          }
        </div>
        <div className="col" style={this.blockStyle("Title")}>
          <div className="row x-center">
            <h5 style={{marginRight: 10}}>Event Name</h5>
            <span style={{fontSize: 12}}>{this.state.charCount || 0} / 50</span>
          </div>
          <input type="text" placeholder="Something Catchy..." ref="name" onChange={this.onTitleChange.bind(this)} />
        </div>
        <div className="col" style={this.blockStyle("Location")}>
          <LocationSelect ref="location" online={false} onChange={this.onChange.bind(this)} />
        </div>
        <div className="col" style={{marginBottom: 20}} style={this.blockStyle("Description")}>
          <Editor onChange={this.setDescriptionState.bind(this)} useInsert={true} usePara={true} useTable={true} />
        </div>
        <div className="row col-2" style={{marginBottom: 20}} style={this.blockStyle("Time")}>
          <div className="col-1 x-center center">
            <h5 style={{marginBottom: 10}}>Date</h5>
            <div>
              <DateInput ref="date" />
            </div>
          </div>
          <div className="col-1 col x-center">
            <h5 style={{marginBottom: 10}}>Time</h5>
            <div className="row center x-center col-1" style={{marginBottom: 4, padding: "0 15px", border: "2px solid white", backgroundColor: "#333"}}>
              <TimeInput ref="time" />
            </div>
          </div>
        </div>
        <div style={this.blockStyle("Banner")}>
          <h5>Event Image (Optional)</h5>
          <div className="row center">
          <ImageForm ref="image" collection={Banners} aspectRatio={16/9} onImgSelected={this.setImage.bind(this)} defaultImage={this.state.image} />
          </div>
        </div>
      </div>
    )
  }
}
