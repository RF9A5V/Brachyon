import React, { Component } from "react";
import Modal from "react-modal";
import moment from "moment";

import DateSelect from "/imports/components/events/create/date_input.jsx";
import TimeSelect from "/imports/components/events/create/time_input.jsx";

import Games from "/imports/api/games/games.js";

export default class RerunModal extends Component {

  onRerun() {
    var date = this.refs.date.value();
    var time = this.refs.time.value();
    var target = moment();
    Object.keys(date).forEach(k => {
      target.set(k, date[k]);
    });
    Object.keys(time).forEach(k => {
      target.set(k, time[k])
    })
    Meteor.call("events.reinstantiate", this.props.id, target.toDate(), (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Event has been reinstantiated!");
        this.props.onComplete(data);
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
    var allBracketsClosed = !instance.brackets || instance.brackets.every(b => {
      return b.isComplete;
    })
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.props.onClose} style={{
        content: {
          width: "50%",
          minWidth: 300
        }
      }}>
          <div style={{maxHeight: "70vh", overflowY: "auto", padding: "0 80px"}}>
            <h1 style={{textAlign: "center"}}>Rerun Event</h1>
            {
              !allBracketsClosed && !event.isComplete ? (
                <div>
                  <p style={{textAlign: "center", margin: "20px 0"}}>
                    The event you are attempting to rerun has open brackets. Close them here in order to save the results and generate stats. Closing the event now will delete your open brackets.
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
            <div style={{margin: "20px 0"}}>
              <h4>Set Event Start Time</h4>
              <div className="col center x-center" style={{backgroundColor: "#333", padding: 10}}>
                <div style={{marginBottom: 10}}>
                  <DateSelect ref="date" />
                </div>
                <TimeSelect ref="time" />
              </div>
            </div>
            <div className="row center">
              <button style={{marginRight: 10}} className="login-button" onClick={this.props.onClose}>Cancel</button>
              <button className="signup-button" onClick={this.onRerun.bind(this)}>Rerun</button>
            </div>
        </div>
      </Modal>
    )
  }
}
