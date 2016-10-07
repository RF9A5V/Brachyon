import React, { Component } from 'react';
import moment from "moment";

import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';
import ImageForm from "../../public/img_form.jsx";

import { Images } from "/imports/api/event/images.js";

export default class DetailsPanel extends Component {

  value() {
    if(this.refs.name.value == "") {
      toastr.error("Details name needs definition.");
      throw new Error("Details name needs definition.");
    }
    else if(this.refs.location.value() == null) {
      toastr.error("Details location needs definition.");
      throw new Error("Details location needs definition.");
    }
    else if(this.refs.description.value == "") {
      toastr.error("Details description needs definition.");
      throw new Error("Details description needs definition.");
    }
    else if(this.refs.date.value() == null || this.refs.time.value() == null) {
      toastr.error("Details datetime needs definition.");
      throw new Error("Details datetime needs definition.");
    }
    else {
      return {
        name: this.refs.name.value,
        location: this.refs.location.value(),
        description: this.refs.description.value,
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

  render() {
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <i style={{lineHeight: 1.5}}>
            This part's required. All the admin stuff having to do with where and when your event is happening goes here.
          </i>
        </div>
        <div className="col">
          <h5>Event Name</h5>
          <input type="text" placeholder="Event Name" ref="name" onChange={this.onChange.bind(this)} />
        </div>
        <div>
          <h5>Event Image (Optional)</h5>
          <ImageForm ref="image" collection={Images} callback={() => {}} aspectRatio={16/9}/>
        </div>
        <div className="col">
          <LocationSelect ref="location" onChange={this.onChange.bind(this)} />
        </div>
        <div className="col">
          <h5>Description</h5>
          <textarea ref="description" placeholder="Any additional details about the event (parking, rules, etc)..." onChange={this.onChange.bind(this)}></textarea>
        </div>
        <div className="row col-2">
          <div className="col-1 x-center center">
            <h5 style={{marginBottom: 10}}>Date</h5>
            <div>
              <DateInput ref="date" />
            </div>
          </div>
          <div className="col-1 x-center center">
            <h5 style={{marginBottom: 10}}>Time</h5>
            <TimeInput ref="time" />
          </div>
        </div>
      </div>
    )
  }
}
