import React, { Component } from 'react'

export default class MatchBlock extends Component {

  onMatchUserClick(index) {
    return function(e) {
      e.preventDefault();
      Meteor.call("events.advance_match", this.props.id, this.props.bracket, this.props.roundNumber, this.props.matchNumber, index, function(err) {
        if(err){
          console.log(err);
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          toastr.success("Player advanced to next round!", "Success!");
        }
      })
    }
  }

  getUsername(id) {
    // return Meteor.users.findOne(id).username;
    return id;
  }

  render() {
    var [i, j, match] = [this.props.roundNumber, this.props.matchNumber, this.props.match];
    var k = this.props.bracket ? Math.floor(i/2):i;
    return (
      <div className="match-block col center" style={{height: 50 * Math.pow(2, k)}}>
        {
          match.playerOne == match.playerTwo && i == 0 && this.props.bracket == 0 || this.props.bracket == 1 && (i == 0 || i == 1) && match.truebye == null ? (
            ""
          ) : (
            [match.playerOne, match.playerTwo].map((p, index) => {

              var isLoser = match.winner != null && match.winner != p;

              return (
                <div className={match.winner == null && match.playerOne != null && match.playerTwo != null ? ("match-participant match-active"):("match-participant")} onClick={
                  match.winner == null && match.playerOne != null && match.playerTwo != null ? (
                    this.onMatchUserClick(index).bind(this)
                  ) : (
                    () => {}
                  )
                } style={{borderColor: this.props.isFutureLoser ? ("#999") : ("white")}}>
                  <span style={{color: isLoser || this.props.isFutureLoser ? "#999" : "white"}}>
                    {
                      p == null ? (
                        "TBD"
                      ) : (
                        this.getUsername(p)
                      )
                    }
                  </span>
                </div>
              )
            })
          )
        }
        {
          i == this.props.roundSize - 1 || match.playerOne == match.playerTwo && i == 0 || this.props.bracket == 1 && (i%2 == 0 || (i < 2 && match.truebye == null)) || this.props.bracket == 2 ? (
            ""
          ) : (
            j % 2 == 0 ? (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)), top: 50 * Math.pow(2, k - 1) - 2.5, backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 1 : 2 }}></div>
            ) : (
              <div className="bracket-line-v" style={{height: 50 * Math.pow(2, k) - (5 * (Math.pow(2, k) - 1)), bottom: 50 * Math.pow(2, k - 1) - 2.5, backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 1 : 2 }}></div>
            )
          )
        }
      </div>
    )
  }
}
