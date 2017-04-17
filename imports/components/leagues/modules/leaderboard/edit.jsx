import React, { Component } from "react";

import { sortPlacement } from "/imports/api/placement.js";

export default class LeaderboardEdit extends Component {

  value() {
    return null;
  }

  leaderboard() {
    var index = this.props.index;
    var leaderboard = Leagues.findOne().leaderboard;
    const event = Events.findOne({slug: Leagues.findOne().events[index].slug});
    const instance = Instances.findOne(event.instances[event.instances.length - 1]);
    const bracket = Brackets.findOne(instance.brackets[0].id);
    if(!bracket || !bracket.complete) {
      return (
        <div className="row center">
          <h5>Waiting for this event to complete!</h5>
        </div>
      )
    }
    var placement = sortPlacement(instance.brackets[0].format.baseFormat, bracket.rounds);
    var currentPlace = 1;
    var getSuffix = (place) => {
      switch(place % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    }
    return (
      <div>
        {
          placement.map((users, i) => {
            var place = currentPlace;
            currentPlace += users.length;
            var nextPlace = currentPlace - 1;
            return (
              <div className="col table-row" style={{padding: 10, backgroundColor: "transparent"}}>
                <div className="row flex-pad x-center">
                  <h5>{place + getSuffix(place)}{ nextPlace != place ? ` - ${nextPlace + getSuffix(nextPlace)}` : "" }</h5>
                  <div className="row x-center">
                    <span style={{marginRight: 10}}>
                      {leaderboard[index][users[0].id].score} +
                    </span>
                    <input type="number" style={{width: 200, margin: 0, fontSize: 12, marginRight: 10}} onBlur={(e) => {
                      var value = parseInt(e.target.value);
                      if(isNaN(value)) {
                        e.target.value = 0;
                        return;
                      }
                      Meteor.call("leagues.leaderboard.setBonusByPlacement", Leagues.findOne()._id, index, value, i, (err) => {
                        if(err) {
                          toastr.error(err.reason);
                        }
                      })
                    }} defaultValue={leaderboard[index][users[0].id].bonus} />
                    <button>Save</button>
                  </div>
                </div>
                <div className="row" style={{flexWrap: "wrap"}}>
                  {
                    users.map(u => {
                      var user = Meteor.users.findOne(u.id);
                      return (
                        <div className="row" style={{marginRight: 10, marginBottom: 10}}>
                          <img src={user.profile.imageUrl || "/images/profile.png"} style={{width: 50, height: 50}} />
                          <div style={{padding: 10, backgroundColor: "#666", width: 150}}>
                            { u.alias }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }

  render() {
    return this.leaderboard()
  }
}
