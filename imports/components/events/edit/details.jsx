import React, { Component } from "react";

import LocationSelect from "../create/location_select.jsx";
import DateInput from "../create/date_input.jsx";
import TimeInput from "../create/time_input.jsx";
import ImageForm from "../../public/img_form.jsx";

class DateTimeWrapper extends Component {

  value() {
    return new Date(this.refs.date.value() + "T" + this.refs.time.value());
  }

  render() {
    return (
      <div>
        <div>
          <DateInput init={this.props.time} ref="date" />
        </div>
        <TimeInput init={this.props.time} ref="time" />
      </div>
    )
  }
}

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  updateAction(action){
    return (e) => {
      var value = this.refs[action].value;
      if(typeof(value) == "function"){
        value = this.refs[action].value();
      }
      Meteor.call(`events.updateDetails${action[0].toUpperCase() + action.slice(1)}`, this.state.id, value, function(err) {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success(`Updated ${action}.`, "Success!");
        }
      });
    }
  }

  render() {
    var details = Events.findOne().details;
    return (
      <div className="col">
        <div className="row">
          <div className="side-tab-panel col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Event Name</h3>
              <button style={{margin: 0}} onClick={this.updateAction("name").bind(this)}>Save</button>
            </div>
            <input type="text" defaultValue={details.name} ref="name" />
          </div>
          <div className="side-tab-panel col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Event Banner</h3>
              <button style={{margin: 0}} onClick={this.updateAction("banner").bind(this)}>Save</button>
            </div>
            <ImageForm id={(Images.findOne(details.banner) || {})._id} aspectRatio={16/9} ref="banner" collection={Images} />
          </div>
        </div>
        <div className="row">
          <div className="side-tab-panel col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Event Description</h3>
              <button style={{margin: 0}} onClick={this.updateAction("description").bind(this)}>Save</button>
            </div>
            <textarea defaultValue={details.description} ref="description" style={{width: "100%"}}></textarea>
          </div>
        </div>
        <div className="row">
          <div className="side-tab-panel col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Event Location</h3>
              <button style={{margin: 0}} onClick={this.updateAction("location").bind(this)}>Save</button>
            </div>
            <LocationSelect {...details.location} ref="location" />
          </div>
          <div className="side-tab-panel col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Event Start Time</h3>
              <button style={{margin: 0}} onClick={this.updateAction("startTime").bind(this)}>Save</button>
            </div>
            <DateTimeWrapper time={details.startTime} ref="startTime" />
          </div>
        </div>
      </div>
    )
  }
}
