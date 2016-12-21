import React, { Component } from "react";
import moment from "moment";

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

  render() {
    var eventDate = this.props.date;
    var log = this.props.changelog;
    if(log && log.events && log.events[this.props.slug]) {
      if(log.events[this.props.slug].date) {
        eventDate = log.events[this.props.slug].date;
      }
    }
    return (
      <div>
        <h5 style={{marginBottom: 10}}>{ this.props.name }</h5>
        <h5>Event Start Date</h5>
        <div className="row x-center center">
          <div style={{marginRight: 20}}>
            <DateInput init={eventDate} startsAt={this.props.startAt} onChange={(date) => {
              var temp = moment(eventDate);
              var cur = moment(date);
              if(!log.events) {
                log.events = {};
              }
              if(!log.events[this.props.slug]) {
                log.events[this.props.slug] = {};
              }
              var check = temp.year(cur.year()).month(cur.month()).date(cur.date()).toDate();
              log.events[this.props.slug].date = check;
              this.props.forceUpdate();
            }} />
          </div>
          <div>
            <TimeInput init={eventDate} onChange={(date) => {
              var temp = moment(eventDate);
              var cur = moment(date);
              if(!log.events) {
                log.events = {};
              }
              if(!log.events[this.props.slug]) {
                log.events[this.props.slug] = {};
              }
              log.events[this.props.slug].date = temp.hour(cur.hour()).minute(cur.minute()).toDate();

              this.props.forceUpdate();
            }} />
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
