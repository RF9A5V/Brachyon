import React, { Component } from "react";

import Leagues from "/imports/api/leagues/league.js";

export default class LeaderboardPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }

  leaderboardHeader() {
    var leaderboard = Leagues.findOne().leaderboard;
    return (
      <div className="row" style={{marginBottom: 20}}>
        {
          leaderboard.map((ldr, i) => {
            var event = Events.findOne({ slug: Leagues.findOne().events[i - 1] });
            return (
              <div style={{padding: 10, backgroundColor: "#111", marginRight: 10, cursor: "pointer", color: this.state.index == i ? "#00BDFF" : "#FFF"}} onClick={() => { this.setState({ index: i }) }}>
                { i == 0 ? "Main" : event.details.name }
              </div>
            )
          })
        }
      </div>
    )
  }

  currentLeaderboard(index) {
    var leaderboard = Leagues.findOne().leaderboard;
    return (
      <div className="col">
        {
          leaderboard[index].map((obj, i) => {
            var user = Meteor.users.findOne(obj.id);
            return (
              <div className="row x-center table-row">
                <div className="col-2">
                  { user.username }
                </div>
                <div className="col-1">
                  { obj.score }
                </div>
                <div className="col-1">
                  {
                    index == 0 ? (
                      "+ " + obj.bonus
                    ) : (
                      [
                        <input type="number" style={{margin: 0, marginRight: 10}} defaultValue={obj.bonus || 0} ref={`${i}`}
                          onKeyPress={(e) => { if(e.key == "Enter") { e.target.blur() } }}
                          onBlur={(e) => {
                            Meteor.call("leagues.leaderboard.setBonus", Leagues.findOne()._id, index, i, e.target.value, (err) => {
                              if(err) {
                                toastr.error("Couldn\'t update bonus points");
                              }
                            })
                          }}
                        />,
                        <button>
                          {
                            // This does nothing. It's here for users to click such that blur gets called on the input.
                          }
                          Save
                        </button>
                      ]
                    )
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className="col">
        { this.leaderboardHeader() }
        { this.currentLeaderboard(this.state.index) }
      </div>
    )
  }
}
