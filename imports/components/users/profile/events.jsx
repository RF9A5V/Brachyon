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

  componentDidMount() {
    super.componentDidMount();
    const limit = this.state.mobile ? 8 : 16;
    const action = this.props.type == "player" ? "users.getPlayerEvents" : "users.getOwnerEvents";
    Meteor.call(action, this.props.username, 0, limit, (err, data) => {
      this.setState({
        ready: true,
        data
      })
    })
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
      <div className="row" style={{flexWrap: "wrap", padding: 20}}>
        {
          this.state.data.map(e => {
            return (
              <EventResult {...e} />
            )
          })
        }
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
