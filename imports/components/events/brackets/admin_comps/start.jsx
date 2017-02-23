import React, { Component } from "react";
import Modal from "react-modal";
import { browserHistory } from "react-router";

export default class StartBracketAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: (Events.findOne() || {})._id || Instances.findOne()._id,
      open: false
    }
  }

  startEventHandler() {
    var event = Events.findOne();
    var startFunc = () => {
      Meteor.call("events.start_event", this.state.id, this.props.index || 0, (err) => {
        if(err){
          return toastr.error(err.reason, "Error!");
        }
        else {
          this.props.onStart()
          toastr.success("Successfully started bracket!", "Success!");
        }
      });
    }
    if(!event) {
      startFunc();
    }
    if(event.league) {
      Meteor.call("leagues.checkEventCanRun", event.league, event.slug, (err, data) => {
        if(err) {
          return toastr.error(err,reason, "Error!");
        }
        else {
          if(data.success) {
            startFunc();
          }
          else {
            this.setState({
              rez: data,
              open: true
            });
          }
        }
      });
    }
    else {
      startFunc();
    }
  }

  leagueContent() {
    if(!this.state.rez) {
      return (
        <div></div>
      );
    }
    if(this.state.rez.action == "bracket") {
      return (
        <div>
          <h5>Close Your Bracket</h5>
          <p>Tom put text here</p>
          <button onClick={() => {
            this.setState({
              open: false
            })
            browserHistory.push(this.state.rez.link)
          }}>Go To Bracket</button>
        </div>
      )
    }
    else if(this.state.rez.action == "event") {
      return (
        <div className="col x-center">
          <h5>Close Your Event</h5>
          <p>Tom put text here</p>
          <button onClick={() => {
            Meteor.call("events.close", this.state.rez.id, (err) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              else {
                Meteor.call("events.start_event", this.state.id, this.props.index || 0, function(err) {
                  if(err){
                    return toastr.error(err.reason, "Error!");
                  }
                  else {
                    toastr.success("Successfully started bracket!", "Success!");
                    this.setState({open: false});
                  }
                });
              }
            })
          }}>Close Event</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="col center x-center col-1" style={{height: "calc(100% - 78px)"}}>
        <button onClick={this.startEventHandler.bind(this)}>Start Bracket</button>
        {
          Events.findOne() && Events.findOne().league ? (
            <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
              { this.leagueContent() }
            </Modal>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
