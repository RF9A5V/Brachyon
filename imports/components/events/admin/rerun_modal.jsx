import React, { Component } from "react";
import Modal from "react-modal";

import DateTimeSelect from "/imports/components/public/datetime_selector.jsx";

export default class RerunModal extends Component {

  onRerun() {
    var date = this.refs.date.value();
    Meteor.call("events.reinstantiate", this.props.id, date, (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Event has been reinstantiated!");
        const sub = Meteor.subscribe("event", this.props.id, {
          onReady: () => {
            this.props.onComplete(sub);
          }
        })

      }
    })
  }

  render() {
    if(!this.props.id) {
      return null;
    }
    var event = Events.findOne(this.props.id);
    var instance = Instances.findOne(event.instances.pop());
    if(!instance) {
      return null;
    }
    var allBracketsClosed = instance.brackets.every(b => {
      return b.isComplete;
    })
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.props.onClose} style={{
        content: {
          width: "50%",
          minWidth: 300
        }
      }}>
          <div className="col">
            {
              !allBracketsClosed ? (
                <p>
                  Warning for brackets being closed here! Not sure if we want to list each bracket line by line. Do we want links to said brackets?
                </p>
              ) : (
                ""
              )
            }
            <h4>Set Event Start Time</h4>
            <DateTimeSelect ref="date" />
            <div className="row center" style={{marginTop: 10}}>
              <button onClick={this.onRerun.bind(this)}>Rerun</button>
            </div>
        </div>
      </Modal>
    )
  }
}
