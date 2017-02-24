import React, { Component } from "react";
import Editor from "/imports/components/public/editor.jsx";

export default class DescriptionPage extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    this.state = {
      id: Events.findOne()._id,
      titleLength: event.details.name.length,
      content: event.details.description
    }
  }

  value() {
    return {
      name: this.refs.name.value,
      description: this.state.content
    }
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

  updateDescription(content) {
    this.setState({
      content
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div className="col">
        <h4 style={{marginTop: 10}}>Event Details</h4>
        <div style={{marginBottom: 10}} className="submodule-bg">
          <div className="row x-center">
            <h5 style={{marginRight: 20}}>Title</h5>
            <span>{ this.state.titleLength } / 50</span>
          </div>
          <input ref="name" defaultValue={event.details.name} style={{width: "50%", minWidth: 280}} onChange={() => { this.validateTitleInput() }}/>
          <h5 style={{marginBottom: 20}}>Description</h5>
          <Editor value={event.details.description} ref="description" onChange={this.updateDescription.bind(this)} useInsert={true} usePara={true} useTable={true} />
        </div>
      </div>
    )
  }
}
