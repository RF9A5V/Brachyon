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
    var event = Events.findOne();
    Meteor.call("events.start_event", event._id, this.props.index, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ open: false });
        toastr.success("Successfully reset bracket!", "Success!");
      }
    });
  }

  render() {
    var instance = Instances.findOne();
    var bracket = instance.brackets[this.props.index];
    return (
      <div>
        <h4 style={{marginTop: 0}}>Restart the Bracket</h4>
        <div className="submodule-bg">
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
      </div>
    )
  }
}
