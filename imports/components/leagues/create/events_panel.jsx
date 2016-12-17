import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import DateInput from "/imports/components/events/create/date_input.jsx";
import TimeInput from "/imports/components/events/create/time_input.jsx";

export default class EventsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      option: 0,
      events: props.attrs.events,
      charCount: (props.attrs.events[0].name || props.attrs.details.name || "").length
    }
  }

  eventCounter() {
    var events = this.props.attrs.events;
    var decrementIcon = events.length <= 1 ? (
      <FontAwesome name="caret-left" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome name="caret-left" size="3x" onClick={() => { events.pop(); this.forceUpdate(); }} />
    );
    var incrementIcon = events.length >= 30 ? (
      <FontAwesome name="caret-right" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome name="caret-right" size="3x" onClick={() => {
        var event = moment(events[events.length - 1].date);
        console.log(event.toDate());
        events.push({
          date: event.add(1, "day")
        });
        this.forceUpdate(); }} />
    );
    return (
      <div className="row x-center center">
        { decrementIcon }
        <span style={{padding: 10, backgroundColor: "#111", margin: "0 20px"}}>{ events.length }</span>
        { incrementIcon }
      </div>
    )
  }

  categories() {
    var events = this.props.attrs.events;
    var options = events.map((e, i) => { return e.name });
    return options.map((val, i) => {
      var style = {
        backgroundColor: "#111",
        padding: 10,
        width: 100,
        marginRight: 10,
        textAlign: "center",
        cursor: "pointer",
        height: 40,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
      }
      return (
        <div style={style} onClick={() => {
          this.setState({ option: i });
          if(this.refs.name) {
            this.refs.name.value = (val ? (val) : this.props.attrs.details.name || "Default" + " " + (i + 1));
          }
        }}>
          <span style={{color: this.state.option == i ? "#00BDFF" : "#FFF"}}>
          { (val ? (val) : (this.props.attrs.details.name || "Default") + " " + (i + 1)) }
          </span>
        </div>
      )
    })
  }

  form() {
    var event = this.props.attrs.events[this.state.option];
    return (
      <div className="col">
        <div className="row">
          <h5>Event Name</h5>
        </div>
        <input type="text" ref="name" onChange={(e) => {
          var value = e.target.value;
          e.target.value = value.substring(0, 50);
          this.setState({
            charCount: value.length
          });
          event.name = value;
          this.forceUpdate();
        }} defaultValue={event.name || ((this.props.attrs.details.name || "Default") + " " + (this.state.option + 1))} />
        <div className="row x-center center" style={{padding: 20, backgroundColor: "#111"}}>
          <div style={{marginRight: 20}}>
            <DateInput init={event.date} onChange={(date) => {
              var d = moment(date);
              var e = moment(event.date);
              event.date = e.year(d.year()).month(d.month()).date(d.date()).toDate();
            }} startsAt={this.state.option == 0 ? moment().subtract(1, "day").toDate() : moment(this.props.attrs.events[this.state.option - 1].date).toDate()} />
          </div>
          <TimeInput init={event.date} onChange={(time) => {
            var d = moment(time);
            var e = moment(event.date);
            event.time = e.hour(d.hour()).minute(d.minute());
          }} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="col">
        { this.eventCounter() }
        <hr className="user-divider" />
        <div className="row" style={{marginBottom: 10}}>
          { this.categories() }
        </div>
        { this.form() }
      </div>
    )
  }
}
