import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import AutocompleteForm from "/imports/components/public/autocomplete_form.jsx";
import UserTemplate from "/imports/components/public/search_results/user_template.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

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
        <div className="button-row">
          <button onClick={this.onStaffSave.bind(this)}>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center" style={{marginBottom: 20}}>
            <h3>Staff Select</h3>
          </div>
          <AutocompleteForm publications={["userSearch"]} types={[
            {
              type: Meteor.users,
              template: UserTemplate,
              name: "User"
            }
          ]} onChange={this.onStaffSelect.bind(this)} />
        </div>
        <div className="row center">
          {
            this.state.staff.length > 0 ? (
              <div style={{border: "solid 2px white", padding: 20, display: "inline-block", margin: "0 auto", minWidth: 300, maxWidth: "60%", overflowY: "auto", maxHeight: 500}}>
                <div style={{alignItems: "flex-start", marginTop: 10, display: "inline-flex", flexWrap: "wrap"}}>
                  {
                    this.state.staff.map((user, i) => {
                      var img = ProfileImages.findOne(user.img);
                      return (
                        <div className="staff-block">
                          <div className="row" style={{justifyContent: "flex-end", width: "100%"}}>
                            <FontAwesome name="times" style={{alignSelf: "flex-start"}} onClick={() => { this.onStaffRemove(i) }} />
                          </div>
                          <img src={img ? img.link() : "/images/profile.png"} />
                          <span>{ user.username }</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            ) : (
              ""
            )
          }
        </div>
      </div>
    )
  }
}
