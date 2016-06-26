import React, { Component } from 'react';
import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';

export default class DetailsPanel extends Component {
  render() {
    return (
      <form>
        <div className="col">
          <label>Event Name</label>
          <input type="text" />
        </div>
        <div className="col">
          <LocationSelect />
        </div>
        <div className="col">
          <label>Description</label>
          <textarea></textarea>
        </div>
        <div className="col">
          <label>Date</label>
          <div>
            <DateInput />
          </div>
        </div>
        <div className="col">
          <label>Time</label>
          <TimeInput />
        </div>
      </form>
    )
  }
}
