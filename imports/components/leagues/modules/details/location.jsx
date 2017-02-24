import React, { Component } from "react";

import LocationSelect from "/imports/components/events/create/location_select.jsx";

export default class LeagueLocation extends Component {

  value() {
    return this.refs.location.value();
  }

  render() {
    var league = Leagues.findOne();
    return (
      <div>
        <h4>League Location</h4>
        <div className="submodule-bg">
          <LocationSelect {...league.details.location} ref="location" />
        </div>
      </div>
    )
  }
}
