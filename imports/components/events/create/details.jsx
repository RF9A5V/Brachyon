import React, { Component } from 'react';
import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';

export default class DetailsPanel extends Component {

  value() {
    return {
      name: this.refs.name.value,
      location: this.refs.location.value(),
      description: this.refs.description.value,
      datetime: this.refs.date.value() + "T" + this.refs.time.value()
    }
  }

  onChange(e) {
    var loc = this.refs.location.value();
    console.log(loc.online);
    var locationValid = loc.online || Object.keys(loc.location).length;
    this.props.onChange(
      this.refs.name.value != "" && this.refs.description.value != "" && locationValid
    );
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <i style={{lineHeight: 1.5}}>This part's required. All the admin stuff having to do with where and when your event is happening goes here.</i>
        </div>
        <div className="col">
          <label>Event Name</label>
          <input type="text" placeholder="Event Name" ref="name" onChange={this.onChange.bind(this)} />
        </div>
        <div className="col">
          <LocationSelect ref="location" onChange={this.onChange.bind(this)} />
        </div>
        <div className="col">
          <label>Description</label>
          <textarea ref="description" onChange={this.onChange.bind(this)}></textarea>
        </div>
        <div className="col">
          <label>Date</label>
          <div>
            <DateInput ref="date" />
          </div>
        </div>
        <div className="col">
          <label style={{marginBottom: 10}}>Time</label>
          <TimeInput ref="time" />
        </div>
      </div>
    )
  }
}
