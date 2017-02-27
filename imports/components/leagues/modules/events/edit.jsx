import React, { Component } from "react";
import moment from "moment";
import FontAwesome from "react-fontawesome";

import DateInput from "/imports/components/events/create/date_input.jsx";
import TimeInput from "/imports/components/events/create/time_input.jsx";

export default class EditEvent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subs: []
    }
  }

  componentWillUnmount() {
    this.state.subs.forEach(sub => {
      sub.stop();
    })
  }

  value() {
    return null;
  }

  onDateChange(obj) {
    var date = moment(Events.findOne(this.props.id).details.datetime);
    Object.keys(obj).forEach(k => {
      date.set(k, obj[k]);
    });
    Meteor.call("events.details.datetimeSave", this.props.id, date.toDate(), (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      return toastr.success("Event start date set to " + date.format("MMMM Do, YYYY hh:mm") + "!");
    });
  }

  onEventAdd() {
    var league = Leagues.findOne();
    var lastEvent = Events.findOne({ slug: league.events.pop() });
    Meteor.call("leagues.addEvent", league._id, moment(lastEvent.details.datetime).add(1, "day").toDate(), (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully added event!");
        this.state.subs.push(Meteor.subscribe("event", data, {
          onReady: () => {
            this.forceUpdate();
            if(this.props.update) {
              this.props.update();
            }
          }
        }))
      }
    })
  }

  onEventRemove(index) {
    Meteor.call("leagues.removeEvent", Leagues.findOne()._id, index, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      toastr.success("Removed event.");
      if(this.props.update) {
        this.props.update();
      }
      this.forceUpdate();
    })
  }

  render() {
    var event = Events.findOne(this.props.id);
    var league = Leagues.findOne();
    return (
      <div>
        <div className="row center x-center">
          <FontAwesome name="caret-left" size="3x" style={{opacity: league.events.length == 1 ? 0.3 : 1}} onClick={() => {
            if(league.events.length > 1) {
              this.onEventRemove(league.events.length - 1);
            }
          }} />
          <div className="row center x-center" style={{padding: 10, fontSize: 24, backgroundColor: "#111", margin: "0 10px"}}>
            { league.events.length }
          </div>
          <FontAwesome name="caret-right" size="3x" onClick={this.onEventAdd.bind(this)} />
        </div>
        <hr className="user-divider" />
        <div className="col center x-center">
          <div style={{marginBottom: 20}}>
            <DateInput startsAt={this.props.startsAt} init={event.details.datetime} onChange={this.onDateChange.bind(this)} />
          </div>
          <TimeInput init={event.details.datetime} onChange={this.onDateChange.bind(this)} />
          {
            league.events.length > 1 ? (
              <button style={{marginTop: 10}} onClick={() => {
                if(league.events.length > 1) {
                  this.onEventRemove(this.props.index);
                }
              }}>
                Delete
              </button>
            ) : (
              ""
            )
          }

        </div>
      </div>
    )
  }
}
