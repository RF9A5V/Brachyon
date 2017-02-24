import React, { Component } from "react";

export default class LeagueNameInput extends Component {

  value() {
    return this.refs.name.value + " " + this.refs.season.value;
  }

  render() {
    var league = Leagues.findOne();
    var byItem = league.details.name.split(" ");
    var season = byItem.pop();
    return (
      <div>
        <h4>League Name</h4>
        <div className="row submodule-bg">
          <div className="col col-2">
            <h5>League Name</h5>
            <input type="text" ref="name" defaultValue={byItem.join(" ")} />
          </div>
          <div className="col col-1">
            <h5>Season</h5>
            <input type="number" ref="season" defaultValue={season} />
          </div>
        </div>
      </div>
    )
  }
}
