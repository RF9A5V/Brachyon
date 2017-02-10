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
      events: [
        {
          date: moment().add(1, "hour").startOf("hour").toDate()
        }
      ],
      title: "",
      season: ""
    }
  }

  value() {
    var { title, season } = this.props.getRefValue("details", "name");
    if(title.length == 0 || season.length == 0) {
      toastr.error("League or season name can't be empty!");
      throw new Error("Name or season for league must be defined.");
    }
    return this.state.events.map(e => {
      return e.date;
    });
  }

  componentDidMount() {
    var { title, season } = this.props.getRefValue("details", "name");
    this.setState({
      title: title,
      season: season
    })
  }

  componentWillReceiveProps() {
    this.componentDidMount();
  }

  eventCounter() {
    var events = this.state.events;
    var decrementIcon = events.length <= 1 ? (
      <FontAwesome style={{cursor: "pointer"}} name="caret-left" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome style={{cursor: "pointer"}} name="caret-left" size="3x" onClick={() => { events.pop(); this.forceUpdate(); }} />
    );
    var incrementIcon = events.length >= 30 ? (
      <FontAwesome style={{cursor: "pointer"}} name="caret-right" size="3x" style={{opacity: 0.3}} />
    ) : (
      <FontAwesome style={{cursor: "pointer"}} name="caret-right" size="3x" onClick={() => {
        var event = moment(events[events.length - 1].date);
        events.push({
          date: event.add(1, "day").toDate()
        });
        this.setState({
          option: events.length - 1
        })
      }} />
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
    var events = this.state.events;
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
        }}>
          <span style={{color: this.state.option == i ? "#FF6000" : "#FFF"}}>
          { ((this.state.title || "Default") + " " + (this.state.season || 1) + "." + (i + 1)) }
          </span>
        </div>
      )
    })
  }

  form() {
    var event = this.state.events[this.state.option];
    return (
      <div className="col">
        <div className="row">
          <h5>{ ((this.state.title || "Default") + " " + (this.state.season || 1) + "." + (this.state.option + 1)) }</h5>
        </div>
        <div className="row x-center center" style={{padding: 20, backgroundColor: "#111"}}>
          <div style={{marginRight: 20}}>
            <DateInput init={event.date} onChange={(date) => {
              var e = moment(event.date);
              Object.keys(date).forEach(key => {
                e.set(key, date[key]);
              });
              this.state.events[this.state.option].date = e.toDate();
              this.forceUpdate();
            }} startsAt={this.state.option == 0 ? moment().subtract(1, "day").startOf("day").toDate() : moment(this.state.events[this.state.option - 1].date).startOf("day").toDate()} />
          </div>
          <TimeInput init={event.date} onChange={(time) => {
            var e = moment(event.date);
            Object.keys(key => {
              e.set(key, time[key]);
            })
            this.state.events[this.state.option].date = e.toDate();
            this.forceUpdate();
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
