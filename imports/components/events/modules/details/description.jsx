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
        <div className="row flex-pad x-center">
          <span>Description</span>
          <button onClick={this.onDescriptionSave.bind(this)}>Save</button>
        </div>
        <span>Event Title</span>
        <input ref="name" defaultValue={event.details.name} />
        <span>Description</span>
        <textarea ref="description" defaultValue={event.details.description}></textarea>
      </div>
    )
  }
}
