import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import UserTemplate from "/imports/components/public/search_results/user_template.jsx";

export default class StaffPage extends Component {

  constructor() {
    super();
    var event = Events.findOne();
    this.state = {
      staff: (event.organize ? event.organize.staff : null),
      id: event._id
    }
  }

  onStaffCreate() {
    Meteor.call("events.organize.createStaff", this.state.id, (err) => {
      if(err){
        return toastr.error("Couldn't create staff object for event.", "Error!");
      }
      this.setState({
        staff: []
      })
      return toastr.success("Successfully created staff object.", "Success!");
    })
  }

  onStaffSelect(user) {
    this.state.staff.push({
      id: user._id,
      username: user.username,
      img: user.profile.image
    });
    this.forceUpdate();
  }

  onStaffSave() {
    Meteor.call("events.organize.saveStaff", this.state.id, this.state.staff, (err) => {
      if(err){
        return toastr.error("Couldn't save staff for event.", "Error!");
      }
      else {
        return toastr.success("Saved staff.", "Success!");
      }
    })
  }

  onStaffRemove(index) {
    this.state.staff.splice(index, 1);
    this.forceUpdate();
  }

  render() {
    var event = Events.findOne();
    if(this.state.staff == null) {
      return (
        <div className="col center x-center" style={{height: "100%"}}>
          <span>Staff is not set up.</span>
          <button onClick={this.onStaffCreate.bind(this)}>Set Up Staff</button>
        </div>
      )
    }
    return (
      <div>
        <div className="row flex-pad">
          <span>User Select</span>
          <button onClick={this.onStaffSave.bind(this)}>Save</button>
        </div>
        <AutocompleteForm publications={["userSearch"]} types={[
          {
            type: Meteor.users,
            template: UserTemplate,
            name: "User"
          }
        ]} onChange={this.onStaffSelect.bind(this)} />
        <div className="col" style={{alignItems: "flex-start", marginTop: 10}}>
          {
            this.state.staff.map((user, i) => {
              var img = ProfileImages.findOne(user.img);
              return (
                <div className="staff-block">
                  <img src={img ? img.url() : "/images/profile.png"} />
                  <span>{ user.username }</span>
                  <FontAwesome name="times" style={{alignSelf: "flex-start"}} onClick={() => { this.onStaffRemove(i) }} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
