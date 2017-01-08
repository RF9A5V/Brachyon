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
            obj["placement"] = i;
          }
          return obj;
        })
      }
      return sortedBoard.map(obj => {
        var user = Meteor.users.findOne(obj.id);
        return (
          <div className="row">
            <div className="col-2">
              {
                (index > 0 ? ((obj.placement) + ". ") : ("")) + user.username
              }
            </div>
            <div className="col-1">
              {
                obj.score + " + " + obj.bonus + " = " + parseInt(obj.score + obj.bonus)
              }
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
        <div className="col col-1" style={{padding: 20}}>
          <h5>Global Leaderboard</h5>
          <div>
            {
              this.leaderboard(0)
            }
          </div>
        </div>
        <div className="col-1" style={{padding: 20}}>
          <div className="row" style={{marginBottom: 10}}>
            {
              this.props.event.events.map((slug, i) => {
                return (
                  <div style={{paddingBottom: 5, borderBottom: `solid 2px ${this.state.current == i ? "#FF6000" : "#FFF"}`, marginRight: 10, cursor: "pointer"}} onClick={() => { this.setState({ current: i }) }}>
                    Event { i + 1 }
                  </div>
                )
              })
            }
          </div>
          <div>
          {
            this.leaderboard(this.state.current + 1)
          }
          </div>
        </div>
        <div className="col-2">
        </div>
      </div>
    )
  }
}
