import React, { Component } from 'react';
import moment from "moment";

import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';
import ImageForm from "../../public/img_form.jsx";
import Editor from "../../public/editor.jsx";

import { Images } from "/imports/api/event/images.js";

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charCount: 0
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
        description: this.refs.description.value(),
        datetime: moment(this.refs.date.value() + "T" + this.refs.time.value()).toDate(),
        image: this.refs.image.value(true)
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

  render() {
    return (
      <div className="panel">
        <div className="col">
          <div className="row x-center">
            <h5 style={{marginRight: 10}}>Event Name</h5>
            <span style={{fontSize: 12}}>{this.state.charCount || 0} / 50</span>
          </div>
          <input type="text" placeholder="Something Catchy..." ref="name" onChange={this.onTitleChange.bind(this)} />
        </div>
        <div className="col">
          <LocationSelect ref="location" onChange={this.onChange.bind(this)} />
        </div>
        <div className="col" style={{marginBottom: 20}}>
          <h5>Description</h5>
          <Editor ref="description" />
        </div>
        <div className="row col-2" style={{marginBottom: 20}}>
          <div className="col-1 x-center center">
            <h5 style={{marginBottom: 10}}>Date</h5>
            <div>
              <DateInput ref="date" />
            </div>
          </div>
          <div className="col-1 col x-center">
            <h5 style={{marginBottom: 10}}>Time</h5>
            <div className="row center x-center col-1">
              <TimeInput ref="time" />
            </div>
          </div>
        </div>
        <div>
          <h5>Event Image (Optional)</h5>
          <div className="row center">
          <ImageForm ref="image" collection={Images} callback={() => {}} aspectRatio={16/9}/>
          </div>
        </div>
      </div>
    )
  }
}
