import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import EditMenu from "./edit/edit_menu.jsx";

import LoadingScreen from "../public/loading.jsx";

export default class EditEventScreen extends TrackerReact(React.Component){

  constructor(props) {
    super(props);
    this.state = {
      detailsSuite: {},
      event: Meteor.subscribe("event", this.props.params.eventId)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  render() {
    if(!this.state.event.ready()){
      return (
        <LoadingScreen />
      )
    }
    else {
      return (
        <div className="col">
          <EditMenu event={this.event()} />
        </div>
      )
    }
  }
}
