import React, { Component } from "react";
import Modal from "react-modal";

export default class RestartAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  resetEventHandler() {
    var id;
    var event = Events.findOne();
    if(!event) {
      id = Instances.findOne()._id;
    }
    else {
      id = event._id;
    }
    Meteor.call("events.start_event", id, this.props.index || 0, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ open: false });
        toastr.success("Successfully reset bracket!", "Success!");
        this.props.onStart();
      }
    });
  }

  render() {
    return (
      <div>
        <p>
          Warning! This will regenerate your bracket from scratch, throwing everything back to round one. This is not recommended for large events or for events that have already played well into the bracket.
        </p>
        <div className="row center">
          <button onClick={() => { this.setState({ open: true }) }} style={{width:"100px"}}> Reset </button>
        </div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }} >
          <div className="col x-center center">
            <h3>DANGER</h3>
            <p><br></br>This action will be irreversible. You will not be able to roll back the bracket to a previous state except through manual input. Confirm this action.</p>
            <div style={{display:"inline-block"}}>
              <div className="inline-button">
                <button onClick={() => { this.setState({open: false}) }} style={{width:"100px", marginRight:"15px"}}>Cancel</button>
              </div>
              <div className="inline-button">
                <button className="reset-highlight" onClick={this.resetEventHandler.bind(this)} style={{margin:"0", width: "100px"}}>Reset</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
