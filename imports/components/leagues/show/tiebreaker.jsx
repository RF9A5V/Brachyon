import React, { Component } from "react";
import RoundRobinDisplay from "/imports/components/tournaments/roundrobin/display.jsx";

export default class TiebreakerSlide extends Component {
  render() {
    var league = Leagues.findOne();
    return (
      <div className="col-1" style={{padding: 20}}>
        <RoundRobinDisplay bracketId={league.tiebreaker.id} id={Leagues.findOne()._id}/>
      </div>
    )
  }
}
