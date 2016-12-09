import React, { Component } from "react";
import moment from "moment";

import BracketForm from "/imports/components/events/modules/bracket/form.jsx";
import DateSelect from "/imports/components/events/create/date_input.jsx";
import TimeSelect from "/imports/components/events/create/time_input.jsx";

export default class Leagues extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventCount: 1,
      events: [{date: moment(), time: moment()}],
      index: 0
    }
  }

  onInputChange(e) {
    var newAmount = parseInt(e.target.value);
    if(newAmount < this.state.eventCount) {
      this.state.events = this.state.events.slice(0, newAmount);
    }
    else {
      for(var i = this.state.eventCount; i < newAmount; i ++) {
        this.state.events.push({
          date: moment(),
          time: moment()
        });
      }
    }
    this.setState({
      eventCount: newAmount
    })
  }

  render() {
    return (
      <div style={this.props.style}>
        {
          this.props.selected ? (
            <div className="row">
              <div className="col-1" style={{marginRight: 20}}>
                <BracketForm ref="bracket" />
              </div>
              <div className="col col-1">
                <h5>Number of Events</h5>

                <input type="number" ref="numEvents" defaultValue={this.state.eventCount} onChange={this.onInputChange.bind(this)} />
                <div className="row x-center" style={{flexWrap: "wrap", marginBottom: 10}}>
                  {
                    this.state.events.map((event, i) => {
                      return (
                        <div style={{backgroundColor: "#111", padding: 5, cursor: "pointer", marginRight: 5}} onClick={ () => { this.setState({ index: i }) } }>
                          <span style={{color: this.state.index == i ? "#00BDFF" : "#FFF"}}>Event {i + 1}</span>
                        </div>
                      )
                    })
                  }
                </div>
                <div style={{padding: 20, backgroundColor: "#111"}}>
                  <div className="row center" style={{marginBottom: 20}}>
                    <h5>Event {this.state.index + 1}</h5>
                  </div>
                  <div className="row center x-center">
                    <div style={{marginRight: 20}}>
                      <DateSelect init={this.state.events[this.state.index].date} ref={`event_${this.state.index}_date`} onChange={() => { this.state.events[this.state.index].date = this.refs[`event_${this.state.index}_date`].value() }} />
                    </div>
                    <TimeSelect init={this.state.events[this.state.index].time} ref={`event_${this.state.index}_time`} onChange={() => { this.state.events[this.state.index].time = this.refs[`event_${this.state.index}_time`].value() }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col center">
              <h3>Leagues</h3>
              <p>
                {
                  /* League description goes here! */
                }
                Lorem ipsum blah
              </p>
            </div>
          )
        }
      </div>
    )
  }
}
