import React, { Component } from "react";

export default class LeaderboardPanel extends Component {

  participants() {
    return Meteor.users.find({ _id: { $in: this.props.participants } }).fetch();
  }

  imgOrDefault(id) {
    if(id){
      var img = ProfileImages.findOne(id);
      if(img) {
        return img.url();
      }
    }
    return "/images/profile.png";
  }

  topThree() {
    var winners = this.participants().slice(0, 3).map(function(user, i){
      var className = "leaderboard-";
      if(i == 0){
        className += "first";
      }
      else if(i == 1){
        className += "second";
      }
      else {
        className += "third";
      }
      return {
        username: user.username,
        image: user.profile.image,
        cName: className
      }
    });
    return [winners[2], winners[0], winners[1]];
  }

  render() {
    return (
      <div>
        <div className="col x-center">
          <div className="leaderboard-entry-header row center">
            Leaderboard
          </div>
          {
            this.props.isDone ? (
              <div className="leaderboard-entry-header row x-center center">
                {
                  this.topThree().map((winner) => {
                    return (
                      <div className={`col-1 leaderboard-top ${winner.cName}`}>
                        <img src={this.imgOrDefault(winner.image)}/>
                      </div>
                    )
                  })
                }
              </div>
            ) : (
              ""
            )
          }
          <div className="leaderboard-entry-header row">
            <div className="row x-center col-1">
              <div className="col-1">Place</div>
              <div className="col-1">
                Image
              </div>
              <div className="col-3">Username</div>
            </div>
            <div className="row col-1"></div>
          </div>
          {
            this.participants().map((user, i) => {
              var style = {};
              if(i == 0){
                style.borderColor = "gold";
              }
              else if(i == 1) {
                style.borderColor = "silver";
              }
              else if(i == 2) {
                style.borderColor = "#CD7F32";
              }
              return (
                <div className="leaderboard-entry row">
                  <div className="row x-center col-1">
                    <h1 className="col-1">{ i + 1 }</h1>
                    <div className="col-1">
                      <img className="leaderboard-photo" src={this.imgOrDefault(user.profile.image)} style={this.props.isDone ? style : {}} />
                    </div>
                    <div className="col-3">{ user.username }</div>
                  </div>
                  <div className="row col-1"></div>
                </div>
              );
            })
          }
        </div>
      </div>
    )
  }
}
