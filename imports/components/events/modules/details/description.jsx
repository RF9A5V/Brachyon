import React, { Component } from "react";
import Editor from "/imports/components/public/editor.jsx";

export default class DescriptionPage extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    this.state = {
      id: Events.findOne()._id,
      titleLength: event.details.name.length
    }
  }

  onDescriptionSave() {
    Meteor.call("events.details.saveDescription", this.state.id, this.refs.name.value, this.refs.description.value(), (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
        return toastr.success("Successfully updated description.", "Success!");
      }
    })
  }

  validateTitleInput() {
    var input = this.refs.name.value;
    if(input.length > 50) {
      input = input.substring(0, 50);
    }
    this.refs.name.value = input;
    this.setState({
      titleLength: input.length
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
          <div className="row x-center">
            <h5 style={{marginRight: 20}}>Title</h5>
            <span>{ this.state.titleLength } / 50</span>
          </div>
          <input ref="name" defaultValue={event.details.name} style={{width: "50%", minWidth: 280}} onChange={() => { this.validateTitleInput() }}/>
          <h5 style={{marginBottom: 20}}>Description</h5>
          <Editor value={event.details.description} ref="description" />
        </div>
      </div>
    )
  }
}
