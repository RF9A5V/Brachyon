import React, { Component } from "react";
import Modal from "react-modal";

export default class StartModal extends Component {

  onBracketStart() {
    const instance = Instances.findOne();
    Meteor.call("events.start_event", instance._id, this.props.index, (e) => {
      if(e) {
        return toastr.error(e.reason);
      }
      this.props.onStart();
      this.props.onClose();
      toastr.success("Successfully started bracket!");
    })
  }

  render() {
    const participants = Instances.findOne().brackets[this.props.index].participants || [];
    const nonChecked = participants.filter(p => { return !p.checkedIn });
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        {
          nonChecked.length == 0 ? (
            <div className="col">
              <span>Starting bracket with {participants.length} players!</span>
              <span>User options from this point on will be disabled.</span>
              <div className="row center">
                <button onClick={this.onBracketStart.bind(this)}>Start</button>
              </div>
            </div>
          ) : (
            <div>
              These participants have not checked in yet.
              {
                nonChecked.map(p => {
                  return (
                    <div>
                      { p.alias }
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </Modal>
    )
  }
}
