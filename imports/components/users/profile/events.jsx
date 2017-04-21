import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import Loader from "/imports/components/public/loader.jsx";

import EventResult from "./event_result.jsx";

export default class UserEvents extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      action: "all",
      skip: 0
    }
  }

  loadEvents(props) {
    this.setState({
      ready: false
    });
    const limit = this.state.mobile ? 8 : 16;
    const action = props.type == "player" ? "users.getPlayerEvents" : "users.getOwnerEvents";
    Meteor.call(action, this.props.username, 0, limit, { type: this.state.action }, (err, data) => {
      console.log(this.state.action);
      this.setState({
        ready: true,
        data
      })
    })
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadEvents(this.props);
  }

  componentWillReceiveProps(next) {
    if(next.type != this.props.type) {
      this.loadEvents(next);
    }
  }

  setNewData(val) {
    this.loadEvents(this.props)
  }

  typeSelector() {
    var options;
    if(this.props.type == "player") {
      options = ["All", "Active", "Completed"].map(i => {
        return (
          <option value={i.toLowerCase()}>
            { i }
          </option>
        )
      })
    }
    else {
      options = ["All", "Unpublished", "Active", "Completed"].map(i => {
        return (
          <option value={i.toLowerCase()}>
            { i }
          </option>
        )
      })
    }
    return (
      <select value={this.state.action} onChange={(e) => {
        this.state.action = e.target.value.toLowerCase();
        this.setNewData(e.target.value);
      }}>
        { options }
      </select>
    )
  }

  renderBase() {
    if(!this.state.ready) {
      return (
        <div className="row center" style={{padding: 50}}>
          <Loader animate={true} width={150} />
        </div>
      )
    }
    return (
      <div className="col">
        <div className="row center">
          { this.typeSelector() }
        </div>
        <div className="row" style={{flexWrap: "wrap", padding: 20}}>
          {
            (this.state.data).map(e => {
              return (
                <EventResult {...e} />
              )
            })
          }
        </div>
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false
    });
  }
}
