import React, { Component } from "react";

export default class DescriptionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onDescriptionSave() {
    Meteor.call("events.details.saveDescription", this.state.id, this.refs.name.value, this.refs.description.value, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated description.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div className="col">
        <div className="button-row">
          <button onClick={this.onDescriptionSave.bind(this)}>Save</button>
        </div>
        <div className="submodule-bg">
          <div className="row center">
            <h3>Event Details</h3>
          </div>
          <h5>Title</h5>
          <input ref="name" defaultValue={event.details.name} style={{width: "50%", minWidth: 280}} />
          <h5>Description</h5>
          <textarea ref="description" defaultValue={event.details.description} style={{width: "50%", minWidth: 280}}></textarea>
        </div>
      </div>
    )
  }
}
