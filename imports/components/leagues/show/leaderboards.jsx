import React, { Component } from "react";

export default class LeaderboardSlide extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = this.props.event.details.bannerUrl ? this.props.event.details.bannerUrl : "/images/bg.jpg";
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  leaderboard(index) {
    var leaderboards = this.props.event.leaderboard;
    if(leaderboards[index].length == 0) {
      return (
        <div>
          Leaderboard is empty!
        </div>
      )
    }
    else {
      var sortedBoard = leaderboards[index].sort(function(a, b) {
        return (b.score + b.bonus) - (a.score + a.bonus);
      });
      if(index > 0) {
        var event = Events.findOne({slug: this.props.event.events[index - 1]});
        var instance = Instances.findOne(event.instances.pop());
        sortedBoard = sortedBoard.map((obj, i) => {
          if(instance.brackets[0].format.baseFormat == "single_elim") {
            obj["placement"] = Math.ceil(Math.log2(i + 1)) + 1;
          }
          else if(instance.brackets[0].format.baseFormat == "double_elim") {
            if(i < 4) {
              obj["placement"] = i;
            }
            else {
              obj["placement"] = Math.ceil(Math.log2(i)) + 2;
            }
          }
          else {
            obj["placement"] = i + 1;
          }
          return obj;
        })
      }
      var index = 0;
      var current = -1;
      return sortedBoard.map(obj => {
        if(obj.score + obj.bonus != current){
          current = obj.score + obj.bonus;
          index += 1;
        }
        var user = Meteor.users.findOne(obj.id);
        return (
          <div className="row leaderboard-record">
            <div className="col-2">
              <span className="leaderboard-placement">{(index) + ". "}</span>
              <span className="leaderboard-name" style={{color: `${index == 1 ? "#FF6000" : "white"}`, fontSize: 20 - (2 * Math.min(index, 4))}}>{user.username}</span>
            </div>
            <div className="col-1">
              <span style={{color: `${index == 1 ? "#FF6000" : "white"}`}}>{ current}</span>
            </div>
          </div>
        )
      })
    }
  }

  render() {
    var leaderboards = this.props.event.leaderboard;
    return (
      <div className="col-1 row slide" style={{backgroundImage: this.backgroundImage(false)}}>
        <div className="col col-1 league-leaderboard" style={{padding: 20, marginLeft: 60}}>
          <h5 className="row center" style={{marginBottom: 18}}>Global Leaderboard</h5>
          <div className="row">
            <div style={{fontWeight: "bold"}} className="col-2">
              Players
            </div>
            <div style={{fontWeight: "bold"}} className="col-1">
              Points
            </div>
          </div>
          <div>
            {
              this.leaderboard(0)
            }
          </div>
        </div>
        <div className="col-1 league-leaderboard event-leaderboards" style={{padding: 20, marginLeft: 20, marginRight: 60}}>
          <div className="row" style={{marginBottom: 10}}>
            {
              this.props.event.events.map((slug, i) => {
                return (
                  <div style={{paddingBottom: 5, borderBottom: `solid 2px ${this.state.current == i ? "#FF6000" : "transparent"}`, marginRight: 10, cursor: "pointer"}} onClick={() => { this.setState({ current: i }) }}>
                    Event { i + 1 }
                  </div>
                )
              })
            }
          </div>
          <div className="row">
            <div style={{fontWeight: "bold"}} className="col-2">
              Players
            </div>
            <div style={{fontWeight: "bold"}} className="col-1">
              Points
            </div>
          </div>
          <div>
          {
            this.leaderboard(this.state.current + 1)
          }
          </div>
        </div>
      </div>
    )
  }
}
