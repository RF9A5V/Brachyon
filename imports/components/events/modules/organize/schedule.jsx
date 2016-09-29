import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import TimeInput from "/imports/components/events/create/time_input.jsx";

export default class SchedulePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      tempDays: [],
      day: -1,
      timeIndex: -1
    }
  }

  addDay() {
    Meteor.call("events.organize.schedule.addDay", this.state.id, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Added day to schedule.");
      }
    })
  }

  selectDay(index) {
    this.setState({
      day: index == this.state.day ? -1 : index,
      timeIndex: this.state.day != index ? -1 : this.state.timeIndex
    })
  }

  deleteDay() {
    Meteor.call("events.organize.schedule.deleteDay", this.state.id, this.state.day, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted day!", "Success!");
      }
    })
  }

  addTime() {
    Meteor.call("events.organize.schedule.addTime", this.state.id, this.state.day, this.refs.time.value(), (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully added time to schedule!", "Success!");
      }
    })
  }

  selectTime(index){
    var day = Events.findOne().organize.schedule[this.state.day];
    this.state.timeIndex = this.state.timeIndex == index ? -1 : index;
    if(this.state.timeIndex >= 0 && this.refs.title) {
      this.refs.title.value = day[this.state.timeIndex].title;
      this.refs.description.value = day[this.state.timeIndex].description;
    }
    this.forceUpdate();
  }

  updateTime() {
    Meteor.call("events.organize.schedule.updateTime", this.state.id, this.state.day, this.state.timeIndex, this.refs.title.value, this.refs.description.value, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated time.", "Success!");
      }
    })
  }

  deleteTime() {
    Meteor.call("events.organize.schedule.deleteTime", this.state.id, this.state.day, this.state.timeIndex, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else{
        toastr.success("Successfully removed time!", "Success!");
        this.setState({
          timeIndex: -1
        });
      }
    })
  }

  render() {
    var days = Events.findOne().organize.schedule || [];
    return (
      <div>
        <div className="button-row">
          <button>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row">
            <div className="submodule-section col" style={{width: "15%"}}>
              {
                days.map((val, index) => {
                  return (
                    <div className={`sub-section-select ${ this.state.day == index ? "active" : "" }`} onClick={() => { this.selectDay(index) }}>
                      Day { index + 1 }
                    </div>
                  )
                })
              }
              <div className="sub-section-select row center x-center" onClick={this.addDay.bind(this)} style={{backgroundColor: "#444"}}>
                <FontAwesome name="plus" style={{marginRight: 10}} />
                Add Day
              </div>
            </div>
            {
              this.state.day >= 0 ? (
                <div className="submodule-section">
                  <div className="row center">
                    <h3>Day { this.state.day + 1 }</h3>
                  </div>
                  <div style={{margin: 10, padding: 20, backgroundColor: "#666"}}>
                    <div className="col x-center">
                      <h3>Add A Time</h3>
                      <TimeInput ref="time" />
                      <button style={{marginTop: 20}} onClick={this.addTime.bind(this)}>Update</button>
                    </div>
                  </div>
                  {
                    days[this.state.day].map((item, index) => {
                      return (
                        <div className={`sub-section-select ${index == this.state.timeIndex ? "active" : ""}`} onClick={() => { this.selectTime(index) }}>
                          { item.time }
                        </div>
                      )
                    })
                  }
                  <div className="sub-section-select row center x-center" onClick={ this.deleteDay.bind(this) } style={{backgroundColor: "#444"}}>
                    <FontAwesome name="minus" style={{marginRight: 10}} />
                    Delete Day
                  </div>
                </div>
              ) : (
                ""
              )
            }
            {
              this.state.timeIndex >= 0 && this.state.day >= 0 ? (
                <div className="submodule-section col-1 col">
                  <h5>Title (Optional)</h5>
                  <input type="text" ref="title" defaultValue={days[this.state.day][this.state.timeIndex].title} />
                  <h5>Description</h5>
                  <textarea ref="description" defaultValue={days[this.state.day][this.state.timeIndex].description}>
                  </textarea>
                  <div className="row center">
                    <button onClick={this.deleteTime.bind(this)} style={{marginRight: 10}}>Delete</button>
                    <button onClick={this.updateTime.bind(this)}>Save</button>
                  </div>
                </div>
              ) : (
                ""
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
