import React, { Component } from "react";

export default class LeaderboardSlide extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  userComp(id) {
    var user = Meteor.users.findOne(id);
    var image = user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
    return (
      <div className="row" style={{backgroundColor: "#666", width: 150, marginRight: 10, marginBottom: 10}}>
        <img src={image} style={{width: 50, height: 50}} />
        <div style={{padding: 5}}>
          { user.username }
        </div>
      </div>
    )
  }

  leaderboard(users) {
    var usersByScore = {};

    Object.keys(users).forEach(user => {
      var str = "" + users[user];
      if(usersByScore[str] === undefined) {
        usersByScore[str] = [user];
      }
      else {
        usersByScore[str].push(user);
      }
    });

    return Object.keys(usersByScore).sort((a, b) => {
      [a, b] = [parseInt(a), parseInt(b)];
      return (a < b) ? 1 : -1;
    }).map(score => {
      return (
        <div>
          <h5 style={{marginBottom: 10}}>{ score > 0 ? score : "No" } Points</h5>
          <div className="row" style={{flexWrap: "wrap", marginBottom: 10}}>
          {
            usersByScore[score].map(uid => {
              return this.userComp(uid);
            })
          }
          </div>
        </div>
      )
    })
  }

  users(index) {
    var leaderboards = Leagues.findOne().leaderboard;
    var users = {};
    Object.keys(leaderboards[index]).forEach(p => {
      users[p] = leaderboards[index][p].score + leaderboards[index][p].bonus;
    });
    return users;
  }

  globalLeaderboard() {
    var leaderboards = Leagues.findOne().leaderboard;
    var users = {};
    leaderboards.forEach(l => {
      Object.keys(l).forEach(p => {
        if(!users[p]) {
          users[p] = l[p].score + l[p].bonus;
        }
        else {
          users[p] += l[p].score + l[p].bonus;
        }
      })
    });
    return this.leaderboard(users);
  }

  render() {
    var league = Leagues.findOne();
    var leaderboards = league.leaderboard;
    return (
      <div className="col-1 row">
        <div className="col col-1 league-leaderboard" style={{padding: 20, marginLeft: 60}}>
          <h5 className="row center" style={{marginBottom: 18}}>Global Leaderboard</h5>
          <div>
            {
              this.globalLeaderboard()
            }
          </div>
        </div>
        <div className="col-1 league-leaderboard event-leaderboards" style={{padding: 20, marginLeft: 20, marginRight: 60}}>
          <div className="row" style={{marginBottom: 10}}>
            {
              league.events.map((slug, i) => {
                return (
                  <div style={{paddingBottom: 5, borderBottom: `solid 2px ${this.state.current == i ? "#FF6000" : "transparent"}`, marginRight: 10, cursor: "pointer"}} onClick={() => { this.setState({ current: i }) }}>
                    Event { i + 1 }
                  </div>
                )
              })
            }
          </div>
          <div>
          {
            this.leaderboard(this.users(this.state.current))
          }
          </div>
        </div>
      </div>
    )
  }
}
