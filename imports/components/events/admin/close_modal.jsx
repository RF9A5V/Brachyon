import React, { Component } from "react";
import Modal from "react-modal";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

export default class CloseModal extends Component {

  onClose() {
    Meteor.call("events.close", this.props.id, (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully closed event!");
        if(this.props.onComplete) {
          this.props.onComplete();
        }
        this.props.onClose();
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
                <div style={{padding: "0 80px"}}>
                  <h1 style={{textAlign: "center"}}>Close Event</h1>
                  <p style={{textAlign: "center", margin: "20px 0"}}>
                    The event you are attempting to rerun has an open bracket. Close them here in order to save the results and generate stats. Closing the event now will delete your open bracket.
                  </p>
                  <div>
                    {
                      instance.brackets.map((b, i) => {
                        if(b.isComplete) {
                          return null;
                        }
                        return (
                          <div className="row x-center flex-pad table-row">
                            <span>
                              { b.name || "Bracket " + (i + 1) }
                            </span>
                            <button onClick={() => {
                              browserHistory.push(`/event/${event.slug}/bracket/${i}/admin`)
                            }}>
                              Go To Admin
                            </button>
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
            <div className="row center" style={{marginTop: 10}}>
              <button style={{marginRight: 10}} className="login-button" onClick={this.props.onClose}>Cancel</button>
              <button className="signup-button" onClick={this.onClose.bind(this)}>Close</button>
            </div>
        </div>
      </Modal>
    )
  }
}
