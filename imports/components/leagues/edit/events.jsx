import React, { Component } from "react";
import DateInput from "/imports/components/events/create/date_input.jsx";
import TimeInput from "/imports/components/events/create/time_input.jsx";

class EventsPanel extends Component {
  render() {
    return (
      <div>
        Overview for Events
      </div>
    )
  }
}

class LeagueEvent extends Component {

  componentWillReceiveProps(next) {
    this.refs.name.value = next.name;
  }

  render() {
    return (
      <div>
        <h5>Event Name</h5>
        <input type="text" ref="name" defaultValue={this.props.name} />
        <h5>Event Start Date</h5>
        <div className="row x-center center">
          <div style={{marginRight: 20}}>
            <DateInput init={this.props.date} />
          </div>
          <div>
            <TimeInput init={this.props.date} />
          </div>
        </div>
      </div>
    )
  }
}

export {
  EventsPanel,
  LeagueEvent
}
